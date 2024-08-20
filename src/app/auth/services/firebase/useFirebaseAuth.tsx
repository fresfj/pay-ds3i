import { useState, useEffect, useCallback } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { firebaseInitialized } from './initializeFirebase';

export type FirebaseAuthProps<T> = {
	enabled?: boolean;
	onForgotPassword?: (user: any) => void;
	onUpdatePassword?: (user: any) => void;
	onSignedIn?: (user: firebase.User) => void;
	onSignedUp?: (user: firebase.auth.UserCredential, displayName: string) => void;
	onUpdateUser?: (user: T) => void;
	onSignedOut?: () => void;
	onError?: (error: firebase.auth.Error) => void;
};

export type FirebaseAuth<T> = {
	enabled: boolean;
	user: firebase.User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	forgotPassword: (email: string) => any;
	updatePassword: (currentPassword: string, password: string) => Promise<any>;
	signIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
	signUp: (email: string, password: string, displayName: string) => Promise<firebase.auth.UserCredential>;
	signOut: () => Promise<void>;
	updateUser: (U: T) => Promise<T>;
	setIsLoading: (isLoading: boolean) => void;
};

const useFirebaseAuth = <T,>(props: FirebaseAuthProps<T>): FirebaseAuth<T> | null => {
	const { onForgotPassword, onUpdatePassword, onSignedIn, onSignedUp, onUpdateUser, onSignedOut, onError, enabled = true } = props;

	const [user, setUser] = useState<firebase.User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	if (!firebaseInitialized || !enabled) {
		return null;
	}

	// Effect to handle the initial authentication state
	useEffect(() => {
		let isInitialCheck = true;

		const unsubscribe =
			firebase.apps.length &&
			firebase.auth().onAuthStateChanged(
				(user) => {
					if (user && !isAuthenticated) {
						setUser(user);
						setIsAuthenticated(true);
						onSignedIn?.(user);
					} else if (!isInitialCheck && isAuthenticated) {
						setUser(null);
						setIsAuthenticated(false);
						onSignedOut?.();
					}

					setIsLoading(false);
					isInitialCheck = false;
				},
				(error) => {
					onError?.(error);
					setIsLoading(false);
				}
			);
		return unsubscribe;
	}, [isAuthenticated]);

	const forgotPassword = useCallback((email: string) => {
		return firebase.auth().sendPasswordResetEmail(email)
	}, []);

	const updatePassword = useCallback((currentPassword: string, password: string) => {
		const user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

		const passwordResponse = new Promise<firebase.auth.UserCredential>((resolve, reject) => {
			user.reauthenticateWithCredential(credential)
				.then((userCredential) => {
					user.updatePassword(password)
						.then((res) => {
							onUpdatePassword?.(res);
							resolve(userCredential);
						})
						.catch((_error) => {
							console.error("Erro ao atualizar a senha:", _error);
							onUpdatePassword?.(_error);
							const error = _error as firebase.auth.Error;
							onError?.(error);
							reject(error);
						});
				})
				.catch((_error) => {
					console.error("Erro ao reautenticar o usuário:", _error);
					const error = _error as firebase.auth.Error;
					onError?.(error);
					reject(error);
				});
		});

		return passwordResponse;

	}, []);

	const signIn = useCallback((email: string, password: string) => {
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}, []);


	const signUp = useCallback((email: string, password: string, displayName: string) => {
		const signUpResponse = new Promise<firebase.auth.UserCredential>((resolve, reject) => {
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((userCredential) => {
					onSignedUp(userCredential, displayName);
					resolve(userCredential);
				})
				.catch((_error) => {
					const error = _error as firebase.auth.Error;
					onError?.(error);
					reject(error);
				});
		});

		return signUpResponse;
	}, []);

	const signOut = useCallback(() => {
		return firebase.auth().signOut();
	}, []);

	const updateUser = useCallback((_user: T & { uid: string }) => {
		if (!_user) {
			return Promise.reject(new Error('No user is signed in'));
		}

		firebase.database().ref(`users/${_user.uid}`).set(_user);
		onUpdateUser?.(_user);

		return Promise.resolve(_user);
	}, []);

	return {
		user,
		isAuthenticated,
		isLoading,
		forgotPassword,
		updatePassword,
		signIn,
		signUp,
		signOut,
		updateUser,
		enabled,
		setIsLoading
	};
};

export default useFirebaseAuth;
