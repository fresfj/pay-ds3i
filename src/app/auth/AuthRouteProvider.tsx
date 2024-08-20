import React, { createContext, useCallback, useContext, useMemo } from 'react';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import { useAppDispatch } from 'app/store/store';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen/FuseSplashScreen';
import {
	resetUser,
	selectUser,
	selectUserRole,
	setUser,
	updateUser,
	userSlice
} from 'src/app/auth/user/store/userSlice';
import BrowserRouter from '@fuse/core/BrowserRouter';
import { PartialDeep } from 'type-fest';
import firebase from 'firebase/compat/app';
import _ from '@lodash';
import { useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import useJwtAuth, { JwtAuth } from './services/jwt/useJwtAuth';
import { User } from './user';
import useFirebaseAuth from './services/firebase/useFirebaseAuth';
import UserModel from './user/models/UserModel';
import { setNavigation, updateNavigationItem } from 'app/theme-layouts/shared-components/navigation/store/navigationSlice';
import { navigationConfig, navigationUserConfig } from 'app/configs/navigationConfig';
import { fetchQuizzes } from '../main/apps/quiz/fetchQuizzes';
import NotificationModel from '../main/apps/notifications/models/NotificationModel';
import { useCreateNotificationMutation } from '../main/apps/notifications/NotificationApi';

/**
 * Initialize Firebase
 */

export type SignInPayload = {
	email: string;
	password: string;
};

export type SignUpPayload = {
	displayName: string;
	password: string;
	email: string;
	phone?: string;
};

type AuthContext = {
	jwtService?: JwtAuth<User, SignInPayload, SignUpPayload>;
	firebaseService?: ReturnType<typeof useFirebaseAuth>;
	signOut?: () => void;
	updateUser?: (U: PartialDeep<User>) => void;
	isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContext>({
	isAuthenticated: false
});

type AuthProviderProps = { children: React.ReactNode };

function AuthRoute(props: AuthProviderProps) {
	const { children } = props;
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const [addNotification] = useCreateNotificationMutation();
	/**
	 * Get user role from store
	 */
	const userRole = useSelector(selectUserRole);

	/**
	 * Jwt auth service
	 */
	const jwtService = useJwtAuth({
		config: {
			tokenStorageKey: 'jwt_access_token',
			signInUrl: 'mock-api/auth/sign-in',
			signUpUrl: 'mock-api/auth/sign-up',
			tokenRefreshUrl: 'mock-api/auth/refresh',
			getUserUrl: 'mock-api/auth/user',
			updateUserUrl: 'mock-api/auth/user',
			updateTokenFromHeader: true
		},
		onSignedIn: (user: User) => {
			dispatch(setUser(user));
			setAuthService('jwt');
		},
		onSignedUp: (user: User) => {
			dispatch(setUser(user));
			setAuthService('jwt');
		},
		onSignedOut: () => {
			dispatch(resetUser());
			resetAuthService();
		},
		onUpdateUser: (user) => {
			dispatch(updateUser(user));
		},
		onError: (error) => {
			// eslint-disable-next-line no-console
			console.warn(error);
		}
	});

	const getNotification = async (id: string) => {
		const { allQuizzes, pendingQuizzes, completedQuizzes }: any = await fetchQuizzes(id)
		console.log(`allQuizzes`, allQuizzes)
		console.log(`pendingQuizzes`, pendingQuizzes)
		return pendingQuizzes
	}
	/**
	 * Firebase auth service
	 */
	const firebaseService: AuthContext['firebaseService'] = useFirebaseAuth<User>({
		onSignedIn: (_user) => {
			firebase
				.database()
				.ref(`users/${_user.uid}`)
				.once('value')
				.then(async (snapshot) => {
					let userCollection = null
					const user = snapshot.val() as User;
					const roles = user.role as []
					const rolesFiltrados = roles.filter(role => role === 'admin');

					const notifications = user.data.customer ? await getNotification(user.data.customer?.id) : []



					await firebase.firestore().collection('customers').where('uid', '==', _user.uid)
						.get()
						.then((querySnapshot) => {
							if (!querySnapshot.empty) {
								const customerDoc = querySnapshot.docs[0];
								const customerData = customerDoc.data();

								const updatedAt = typeof customerData.createdAt !== 'string' ? customerData.updatedAt.toDate().toISOString() : customerData.createdAt
								const createdAt = typeof customerData.createdAt !== 'string' ? customerData?.createdAt?.toDate().toISOString() : customerData.createdAt
								customerData.updatedAt = updatedAt;
								customerData.createdAt = createdAt;
								userCollection = customerData
							}
						})

					if (rolesFiltrados.length > 0) {
						dispatch(
							setNavigation(navigationConfig)
						)
					} else {
						dispatch(
							setNavigation(navigationUserConfig)
						);
					}

					if (notifications.length > 0) {
						dispatch(
							updateNavigationItem('apps.quiz', {
								badge: {
									title: notifications.length,
									classes: 'px-2 bg-primary text-on-primary rounded-full'
								}
							})
						);
						const item = NotificationModel({
							title: 'Você tem uma avaliação pendente',
							description: 'Faça sua avaliação agora mesmo e ganhe pontos para trocar por produtos.'
						});
						addNotification(item);

					}
					console.log(`notifications --- `, _user.uid)

					dispatch(setUser({ ...user, data: { ...user.data, customer: userCollection } }));
					setAuthService('firebase');
				});
		},
		onSignedUp: (userCredential, displayName) => {
			const _user = userCredential.user;

			const user = UserModel({
				uid: _user.uid,
				role: ['user'],
				data: {
					displayName,
					email: _user.email
				}
			});

			firebaseService.updateUser(user);

			setAuthService('firebase');
		},
		onSignedOut: () => {
			dispatch(resetUser());
			resetAuthService();
		},
		onUpdateUser: (user) => {
			dispatch(updateUser(user));
		},
		onError: (error) => {
			// eslint-disable-next-line no-console
			console.warn(error);
		}
	});

	/**
	 * Check if services is in loading state
	 */
	const isLoading = useMemo(
		() => jwtService?.isLoading || firebaseService?.isLoading,
		[jwtService?.isLoading, firebaseService?.isLoading]
	);

	/**
	 * Check if user is authenticated
	 */
	const isAuthenticated = useMemo(
		() => jwtService?.isAuthenticated || firebaseService?.isAuthenticated,
		[jwtService?.isAuthenticated, firebaseService?.isAuthenticated]
	);

	/**
	 * Combine auth services
	 */
	const combinedAuth = useMemo<AuthContext>(
		() => ({
			jwtService,
			firebaseService,
			signOut: () => {
				const authService = getAuthService();

				if (authService === 'jwt') {
					return jwtService?.signOut();
				}

				if (authService === 'firebase') {
					return firebaseService?.signOut();
				}

				return null;
			},
			updateUser: (userData) => {
				const authService = getAuthService();

				if (authService === 'jwt') {
					return jwtService?.updateUser(userData);
				}

				if (authService === 'firebase') {
					return firebaseService?.updateUser(_.merge({}, user, userData));
				}

				return null;
			},
			isAuthenticated
		}),
		[isAuthenticated, user]
	);

	/**
	 * Get auth service
	 */
	const getAuthService = useCallback(() => {
		return localStorage.getItem('authService');
	}, []);

	/**
	 * Set auth service
	 */
	const setAuthService = useCallback((authService: string) => {
		if (authService) {
			localStorage.setItem('authService', authService);
		}
	}, []);

	/**
	 * Reset auth service
	 */
	const resetAuthService = useCallback(() => {
		localStorage.removeItem('authService');
	}, []);

	/**
	 * Render loading screen while loading user data
	 */
	if (isLoading) {
		return <FuseSplashScreen />;
	}

	return (
		<AuthContext.Provider value={combinedAuth}>
			<BrowserRouter>
				<FuseAuthorization userRole={userRole}>{children}</FuseAuthorization>
			</BrowserRouter>
		</AuthContext.Provider>
	);
}

function useAuth(): AuthContext {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within a AuthRouteProvider');
	}

	return context;
}

const AuthRouteProvider = withReducer<AuthProviderProps>('user', userSlice.reducer)(AuthRoute);

export { useAuth, AuthRouteProvider };
