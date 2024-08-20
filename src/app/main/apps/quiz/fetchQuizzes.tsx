import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const fetchQuizzes = async (userId: string) => {
  const db = firebase.firestore();
  const quizzesCollection = db.collection('quizzes');
  const userQuizzesRef = db.collection('customers').doc(userId).collection('quizzes');

  return new Promise(async (resolve, reject) => {
    try {
      const quizzesSnapshot = await quizzesCollection.get();
      const userQuizzesSnapshot = await userQuizzesRef.get();

      const allQuizzes = [];
      const completedQuizzes = [];
      const pendingQuizzes = [];

      const userQuizzesMap = new Map();
      userQuizzesSnapshot.forEach(doc => {
        userQuizzesMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      quizzesSnapshot.forEach(doc => {
        const quizData = {
          ...doc.data(),
          id: doc.id,
          modifiedAt: doc.data().modifiedAt.toDate().toISOString(),
          createdAt: doc.data().createdAt.toDate().toISOString(),
        };
        if (userQuizzesMap.has(doc.id)) {
          const userQuizData = userQuizzesMap.get(doc.id);
          if (userQuizData.status === 'realizado') {
            completedQuizzes.push({ ...quizData, ...userQuizData });
          } else if (userQuizData.status === 'pendente') {
            pendingQuizzes.push(userQuizData);
          }
        } else {
          pendingQuizzes.push(quizData);
        }
        allQuizzes.push(quizData);
      });

      resolve({ allQuizzes, pendingQuizzes, completedQuizzes });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUserAndQuizData = async (userId: string, quizId: string, score: number) => {
  const db = firebase.firestore();
  const userDocRef = db.collection('customers').doc(userId);
  const quizDocRef = db.collection('quizzes').doc(quizId);

  return new Promise(async (resolve, reject) => {
    try {
      const userDoc = await userDocRef.get();
      const userData = userDoc.data();
      await userDocRef.set({
        ...userData,
        totalScore: (userData?.totalScore || 0) + score,
      });

      const quizDoc = await quizDocRef.get();
      const quizData = quizDoc.data();
      await quizDocRef.update({
        conclusionsCount: (quizData?.conclusionsCount || 0) + 1,
        totalPoints: (quizData?.totalPoints || 0) + score,
        modifiedAt: firebase.firestore.Timestamp.now(),
      });

      resolve({ userId, quizId, score });
    } catch (error) {
      console.error('Error updating user and quiz data:', error);
      reject(error);
    }
  });
};


const fetchAddUserQuiz = async (userId, id, data) => {
  const db = firebase.firestore();
  const userQuizzesRef = db.collection('customers').doc(userId).collection('quizzes').doc(id)

  return new Promise(async (resolve, reject) => {
    try {
      const sanitizedData = JSON.parse(JSON.stringify(data, (key, value) => {
        if (value instanceof Promise) {
          return undefined;
        }
        return value;
      }));

      await userQuizzesRef.set(sanitizedData);
      resolve({ id, ...sanitizedData });
    } catch (error) {
      reject(error);
    }
  });

}

const fetchGetQuiz = async (id) => {
  const db = firebase.firestore();
  const quizzesCollection = db.collection('quizzes').doc(id);

  return new Promise(async (resolve, reject) => {
    try {
      const quizzesSnapshot = await quizzesCollection.get()
      if (quizzesSnapshot.exists) {
        const data = quizzesSnapshot.data();

        const payload = {
          ...data,
          id: quizzesSnapshot.id,
          modifiedAt: data.modifiedAt.toDate().toISOString(),
          createdAt: data.createdAt.toDate().toISOString(),
        };
        resolve(payload)
      } else {
        throw new Error('Documento do cliente não encontrado')
      }

    } catch (error) {
      reject(error);
    }
  });
};

const fetchAddQuiz = async (data) => {
  const db = firebase.firestore();
  const quizzesCollection = db.collection('quizzes');

  return new Promise(async (resolve, reject) => {
    try {
      const docRef = await quizzesCollection.add(data)
      resolve({ id: docRef.id, ...data })
    } catch (error) {
      reject(error);
    }
  });
};

export { fetchQuizzes, updateUserAndQuizData, fetchGetQuiz, fetchAddQuiz, fetchAddUserQuiz };
