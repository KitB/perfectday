const mapStateToProps = (state, ownProps) => {
    const habit = ownProps.habit || state.pd.habits.get(ownProps.habitId)
    return {
        habit: habit || {short_description: '', long_description: '', },
    }
}

export default mapStateToProps
