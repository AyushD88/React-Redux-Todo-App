import React, { useState } from "react";
import "./App.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import {
  addTodo,
  deleteTodo,
  addCompletedTodo,
  deleteCompletedTodo,
} from "./Features/todos";

function App() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newDeadlineDate, setNewDeadlineDate] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dispatch = useDispatch();

  const allTodos = useSelector((state) => state.todos.allTodos);
  const completedTodos = useSelector((state) => state.todos.completedTodos);

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      reminderDate: newReminderDate,
      deadlineDate: newDeadlineDate,
      status: newStatus || "Pending",
    };

    dispatch(addTodo({ newTodoItem, editIndex }));

    setNewTitle("");
    setNewDescription("");
    setNewReminderDate("");
    setNewDeadlineDate("");
    setNewStatus("Pending");
    setEditIndex(null);
  };

  const handleDeleteTodo = (index) => {
    dispatch(deleteTodo(index));
  };

  const handleComplete = (index) => {
    let now = new Date().getTime();
    let completedOn = now.toLocaleString();
    console.log(now);
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
      status: "Completed",
    };

    dispatch(addCompletedTodo(filteredItem));
    handleDeleteTodo(index);
  };

  const handleEdit = (index) => {
    const item = allTodos[index];
    setNewTitle(item.title);
    setNewDescription(item.description);
    setNewReminderDate(item.reminderDate);
    setNewDeadlineDate(item.deadlineDate);
    setNewStatus(item.status);
    setEditIndex(index);
  };

  const getRemainingTime = (deadlineDate) => {
    const now = new Date().getTime();
    console.log(now);
    const deadline = new Date(deadlineDate).getTime();
    console.log(deadline);
    const remainingTime = deadline - now;
    console.log(remainingTime);

    if (remainingTime < 0) {
      return "Expired";
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getBackgroundColor = (status, reminderDate, deadlineDate) => {
    const today = new Date().toISOString().split("T")[0];

    if (status === "In Progress") {
      if (reminderDate === today) {
        return "purple";
      } else if (deadlineDate === today) {
        return "red";
      } else {
        return "blue";
      }
    }

    switch (status) {
      case "Pending":
        return "yellow";
      case "Done":
        return "green";
      default:
        return "black";
    }
  };

  const getTodayDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  };

  function onchange(set) {
    return (e) => set(e.target.value);
  }

  const filteredTodos = allTodos.filter((todo) => {
    if (filterStatus === "All") return true;
    return todo.status === filterStatus;
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };



  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              required={true}
              type="text"
              value={newTitle}
              name="title"
              onChange={onchange(setNewTitle)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              required={true}
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <label>Reminder Date</label>
            <input
              required={true}
              type="date"
              value={newReminderDate}
              min={getTodayDate()}
              placeholder="DD-MMM-YYYY"
              onChange={(e) => setNewReminderDate(e.target.value)}
            />
          </div>
          <div className="todo-input-item">
            <label>Deadline Date</label>
            <input
              required={true}
              type="date"
              value={newDeadlineDate}
              min={getTodayDate()}
              placeholder="DD-MMM-YYYY"
              onChange={(e) => setNewDeadlineDate(e.target.value)}
            />
          </div>
          {editIndex !== null && (
            <div className="todo-input-item">
              <label>Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          )}
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="todo-wrapper">
          <div className="btn-area">
            <button
              className={`secondaryBtn ${filterStatus === "All" && "active"}`}
              onClick={() => setFilterStatus("All")}
            >
              Todo
            </button>
            <button
              className={`secondaryBtn ${
                filterStatus === "Pending" && "active"
              }`}
              onClick={() => setFilterStatus("Pending")}
            >
              Pending
            </button>
            <button
              className={`secondaryBtn ${
                filterStatus === "In Progress" && "active"
              }`}
              onClick={() => setFilterStatus("In Progress")}
            >
              In Progress
            </button>
            <button
              className={`secondaryBtn ${
                filterStatus === "Completed" && "active"
              }`}
              onClick={() => setFilterStatus("Completed")}
            >
              Completed
            </button>
          </div>

          <div className="todo-list">
            {filterStatus !== "Completed" &&
              filteredTodos.map((item, index) => (
                <div
                  className="todo-list-item"
                  key={index}
                  style={{
                    backgroundColor: getBackgroundColor(
                      item.status,
                      item.reminderDate,
                      item.deadlineDate
                    ),
                    color: "black",
                  }}
                >
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>Reminder Date: {item.reminderDate}</p>
                    <p>Deadline Date: {item.deadlineDate}</p>
                    <p>Status: {item.status}</p>
                    <p>Remaining Time: {getRemainingTime(item.deadlineDate)}</p>
                  </div>

                  <div className="icons">
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteTodo(index)}
                      title="Delete?"
                    />
                    <BsCheckLg
                      className="check-icon"
                      onClick={() => handleComplete(index)}
                      title="Complete?"
                    />
                    <AiOutlineEdit
                      className="check-icon"
                      onClick={() => handleEdit(index)}
                      title="Edit?"
                    />
                  </div>
                </div>
              ))}

            {filterStatus === "Completed" &&
              completedTodos.map((item, index) => (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>Reminder Date: {item.reminderDate}</p>
                    <p>Deadline Date: {item.deadlineDate}</p>
                    <p>
                      <small>Completed on: {item.completedOn}</small>
                    </p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => dispatch(deleteCompletedTodo(index))}
                      title="Delete?"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="calendar-container">
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileContent={({ date, view }) => {
              const dateString = date.toLocaleDateString("en-CA");
              const reminderTodo = allTodos.find(
                (todo) => todo.reminderDate === dateString
              );
              const deadlineTodo = allTodos.find(
                (todo) => todo.deadlineDate === dateString
              );
              return (
                <div className="todo-indicator">
                  {reminderTodo && (
                    <span
                      style={{
                        display: "block",
                        background: "blue",
                        color: "white",
                        borderRadius: "5px",
                        width: "100%", // add some space between the two spans
                      }}
                    >
                      R- {reminderTodo.title}
                    </span>
                  )}
                  {deadlineTodo && (
                    <span
                      style={{
                        display: "block",
                        background: "red",
                        color: "white",
                        borderRadius: "5px",
                        width: "100%",
                      }}
                    >
                      D- {deadlineTodo.title}
                    </span>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
