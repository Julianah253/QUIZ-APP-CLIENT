import { useEffect, useState } from 'react'
// import data from '../database/data'
import { useDispatch } from 'react-redux';
// import data, { answers } from '../database/data'

/** redux actions */
import * as Action from '../redux/questionReducer'
import { getServerData } from '../helper/helper';


/** fetch question hook to fetch api data and set value to store */
export const useFetchQuestion = () => {
    const dispatch = useDispatch();
    const [getData, setGetData] = useState({ isLoading: false, apiData: [], serverError: null});

    useEffect(() => {
        setGetData(prev => ({...prev, isLoading: true}));

        /** async function fetch backend data */
        (async () => {
            try {
                // let question = await data;
                const [{ questions, answers }] = await getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`, (data) => data)
                // console.log({ questions, answers })
                if(questions.length > 0){
                    setGetData(prev => ({...prev, isLoading: false}));
                    setGetData(prev => ({...prev, apiData: questions}));

                    /** dispatch an action */
                    dispatch(Action.startExamAction({ question : questions, answers }))
                } else{
                    throw new Error('No Question Available');
                }
            } catch (error) {
                setGetData(prev => ({...prev, isLoading: false}));
                setGetData(prev => ({...prev, serverError: error.message}));
            }
        })();
    }, [dispatch]);

    return [getData, setGetData]
}

/** nextAction Dispatch Function */
export const MoveNextQuestion = () => async (dispatch) => {
    try{
        dispatch(Action.moveNextAction()) /** increases trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try{
        dispatch(Action.movePrevAction()) /** decreases trace by 1 */
    } catch (error) {
        console.log(error)
    }
}