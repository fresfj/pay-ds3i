import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useAppDispatch } from 'app/store/store';
import ItemIcon from './ItemIcon';
import { FileManagerItem } from './QuizApi';
import { answerQuestion, completeQuiz, setQuestions, setSelectedItemId, resetQuiz } from './store/selectedItemIdSlice';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Iconify } from '@fuse/components/iconify';
import { Image } from '@fuse/components/image';
import { AnimatePresence, m, motion } from 'framer-motion';
import './Quiz.css';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { Timestamp } from 'firebase/firestore';
import { fetchAddUserQuiz, updateUserAndQuizData } from './fetchQuizzes';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

type Props = DialogProps & {
  open: boolean;
  onClose: () => void;
};

/**
 * The folder item.
 */

function QuizDialog({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const { pathname } = location;

  const { questions, currentQuestionIndex, answers, completed, id } = useSelector((state: any) => state.quizApp.quiz);
  const quiz = useSelector((state: any) => state.quizApp.quiz)

  // const [loading, setLoading] = useState(true);


  useEffect(() => {
    const saveResults = async () => {
      if (completed) {
        try {
          const score = await calculateScore(answers);
          await saveQuizResults(user.data.customer.id, score, answers);
          await updateUserAndQuizData(user.data.customer.id, id, score);
        } catch (error) {
          console.error('Error saving quiz results:', error);
        }
      }
    };

    saveResults();
  }, [completed, answers]);

  const handleAnswer = async (answer) => {
    dispatch(answerQuestion(answer));
    if (currentQuestionIndex + 1 === questions.length) {
      const score = await calculateScore(answers);
      dispatch(completeQuiz(score));

    }
  };

  const calculateScore = async (answers) => {
    return answers.length;
  };

  const saveQuizResults = async (userId, score, answers) => {

    const data = {
      score,
      answers,
      completed: true,
      completedAt: new Date().toISOString(),
      status: 'realizado',
      id
    };

    await fetchAddUserQuiz(userId, id, data)

  };

  const handleResetQuiz = () => {
    dispatch(resetQuiz());
  };

  if (!questions) {
    return <div>Carregando...</div>;
  }

  if (completed) {
    return (
      <Dialog
        fullWidth
        fullScreen
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: { md: `calc(100% - 48px)` },
            height: { md: `calc(100% - 48px)` },
          },
        }}
      >

        <Box
          gap={5}
          display="flex"
          alignItems="center"
          flexDirection="column"
          sx={{
            py: 5,
            m: 'auto',
            textAlign: 'center',
            px: { xs: 2, sm: 0 },
          }}
        >
          <DialogContent>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="container mx-auto"
            >
              <Typography variant="h3" className="text-lg font-semibold text-left justify-center items-center align-middle">
                Parabéns!
              </Typography>
              <Typography variant="h2" className="text-7xl font-bold my-4">
                Você completou sua avaliação!
              </Typography>
              <div className="flex flex-col items-center justify-center">
                <Typography variant="h4" className="text-5xl font-semibold">
                  Seu score: {answers.length}
                </Typography>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <img className='inline' src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Clapping%20Hands%20Medium-Light%20Skin%20Tone.png" alt="Clapping Hands Medium-Light Skin Tone" width="100" height="100" />
            </motion.div>

            <Box gap={2} my={8} display="flex" flexWrap="wrap" justifyContent="center">
              <Button
                size="large"
                color="primary"
                variant="contained"
                onClick={onClose}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              >
                Fechar
              </Button>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          borderRadius: 0,
          width: { md: `calc(100% - 48px)` },
          height: { md: `calc(100% - 48px)` },
        },
      }}
    >
      <div className="progress-container mx-24">
        <Typography variant="h5" className='text-md font-medium py-4'><span className='text-2xl font-semibold'>{currentQuestionIndex + 1}</span>/{questions.length}</Typography>
        <BorderLinearProgress variant="determinate" value={((currentQuestionIndex + 1) / questions.length) * 100} />
      </div>
      <Box
        gap={5}
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{
          py: 5,
          m: 'auto',
          px: { xs: 2, sm: 0 },
        }}
      >
        <DialogContent className="container w-screen">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}

            >
              <Typography variant="h3" className='text-lg font-semibold text-left'>Avaliação de Produtos</Typography>
              {currentQuestion &&
                <>
                  <Typography variant="h2" className='text-3xl md:text-5xl font-bold leading-6 md:leading-snug'>{currentQuestion?.text}</Typography>
                  {currentQuestion?.image &&
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >

                      <Image alt={currentQuestion?.text}
                        src={currentQuestion?.image}
                        sx={{
                          width: { xs: 240, md: 320 },
                          height: { xs: 240, md: 320 },
                          borderRadius: 1.5
                        }}
                        ratio="16/9"
                        className="product-image my-12" />
                    </Box>
                  }
                  <Box gap={4} my={4} display="flex" flexWrap="wrap" justifyContent="center">
                    {currentQuestion?.options.map((option, index) => {

                      const gradients = [
                        'linear-gradient(to right top, #007AFF, #00A3FF, #00D4FF)', // Azul para Azul Claro para Ciano
                        'linear-gradient(to right top, #00A3FF, #00D4FF, #00FFE0)', // Azul Claro para Ciano para Verde Água
                        'linear-gradient(to right top, #00D4FF, #00FFE0, #00FFA3)', // Ciano para Verde Água para Verde Claro
                        'linear-gradient(to right top, #00FFE0, #00FFA3, #00FF72)', // Verde Água para Verde Claro para Verde
                        'linear-gradient(to right top, #00FFA3, #00FF72, #12EB12)', // Verde Claro para Verde para Verde Mais Escuro
                        'linear-gradient(to right top, #00FF72, #12EB12, #8BEB34)'  // Verde para Verde Mais Escuro para Verde Mais Claro
                      ];


                      return (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAnswer(option)}
                          className="option-button px-24 py-60 w-160 text-lg font-semibold"
                          style={{
                            background: gradients[index % gradients.length],
                            border: 'none',
                            borderRadius: '5px',
                            color: index % 4 === 0 ? 'white' : 'black',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                          }}
                        >
                          {option}
                        </motion.button>
                      )
                    })}
                  </Box>
                </>
              }
            </motion.div>
          </AnimatePresence>
          <Alert variant="filled" severity="warning" icon={<Iconify icon="eva:alert-triangle-outline" />}
            className='bg-opacity-10 border-opacity-10 rounded-4 h-40 w-full md:w-360 justify-center items-center bg-orange-700 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10 mt-48'>
            Selecione uma das opções acima para prosseguir.
          </Alert>

          <Box gap={2} my={8} display="flex" flexWrap="wrap" justifyContent="center">
            <Button
              size="large"
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              onClick={onClose}
            >
              Fechar
            </Button>

            <Button
              size="large"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="eva:refresh-outline" />}
              onClick={() => handleResetQuiz()}>Reset Quiz</Button>
          </Box>
        </DialogContent>
      </Box>

    </Dialog>
  );
}

export default QuizDialog;
