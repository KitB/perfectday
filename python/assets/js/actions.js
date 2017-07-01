export const SET_HABITS = 'SET_HABITS';

export function setHabits(habits) {
    return {
        type: SET_HABITS,
        payload: {
            habits: habits,
        },
    }
}
