import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import TodoList from './TodoList';
import { getVisibleTodos, getIsFetching, getErrorMessage } from '../reducers';
import FetchError from './FetchError';

class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if(this.props.filter !== prevProps.filter) {
      this.fetchData();  
    }
  }

  fetchData() {
    const { filter, fetchTodos } = this.props;
    fetchTodos(filter);
  }

  render() {
    const { toggleTodo, errorMessage, todos, isFetching } = this.props;
    if(isFetching && !todos.length){
      return <p>Loading...</p>;
    }
    if(errorMessage && !todos.length) {
      return (<FetchError message={errorMessage} onRetry={() => this.fetchData()} />);
    }
    return (
      <TodoList todos={todos} onTodoClick={toggleTodo} />
    );
  }
}

const mapStateToTodoListProps = (state, { match: { params: { filter } } }) => {
  const todoFilter = filter || 'all';
  return {
    todos: getVisibleTodos(state, todoFilter),
    errorMessage: getErrorMessage(state, todoFilter),
    isFetching: getIsFetching(state, todoFilter),
    filter: todoFilter
  }
}

VisibleTodoList = withRouter(connect(mapStateToTodoListProps, actions)(VisibleTodoList));

export default VisibleTodoList;