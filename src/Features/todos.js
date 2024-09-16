// src/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    allTodos: JSON.parse(localStorage.getItem("todolist")) || [],
    completedTodos: JSON.parse(localStorage.getItem("completedTodos")) || []
  },
  reducers: {
    addTodo: (state, action) => {
      const { newTodoItem, editIndex } = action.payload;
      if (editIndex !== null) {
        state.allTodos[editIndex] = newTodoItem;
      } else {
        state.allTodos.push(newTodoItem);
      }
      localStorage.setItem("todolist", JSON.stringify(state.allTodos));
    },
    deleteTodo: (state, action) => {
      const index = action.payload;
      state.allTodos.splice(index, 1);
      localStorage.setItem("todolist", JSON.stringify(state.allTodos));
    },
    editTodo: (state, action) => {
      const { index, updatedTodo } = action.payload;
      state.allTodos[index] = updatedTodo;
      localStorage.setItem("todolist", JSON.stringify(state.allTodos));
    },
    addCompletedTodo: (state, action) => {
      state.completedTodos.push(action.payload);
      localStorage.setItem("completedTodos", JSON.stringify(state.completedTodos));
    },
    deleteCompletedTodo: (state, action) => {
      const index = action.payload;
      state.completedTodos.splice(index, 1);
      localStorage.setItem("completedTodos", JSON.stringify(state.completedTodos));
    }
  }
});

export const { addTodo, deleteTodo, editTodo, addCompletedTodo, deleteCompletedTodo } = todoSlice.actions;

export default todoSlice.reducer;
