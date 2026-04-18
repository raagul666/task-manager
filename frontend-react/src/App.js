import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = process.env.REACT_APP_API;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("all");

  // Authentication Logic
  const register = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }
    try {
      await axios.post(API + "/register", { email, password });
      setMessage("Account created! Please login.");
      setIsLogin(true);
    } catch (err) {
      setMessage("User already exists or server error");
    }
  };

  const login = async () => {
    if (!email || !password) {
      setMessage("Email and password required");
      return;
    }
    try {
      const res = await axios.post(API + "/login", { email, password });
      if (res.data.access_token) {
        setToken(res.data.access_token);
        loadTasks(res.data.access_token, 0, "all");
        setMessage("");
      }
    } catch (err) {
      setMessage("Invalid email or password");
    }
  };

  // Task Management Logic
  const loadTasks = async (tk = token, pg = page, flt = filter) => {
    if (!tk) return;
    let url = `${API}/tasks/?skip=${pg * 5}&limit=5`;
    if (flt === "completed") url += "&completed=true";
    if (flt === "pending") url += "&completed=false";

    try {
      const res = await axios.get(url, {
        headers: { Authorization: "Bearer " + tk }
      });
      setTasks(res.data);
    } catch (err) {
      setToken(""); // Session expired
    }
  };

  const createTask = async () => {
    if (!task.trim()) return;
    await axios.post(API + "/tasks/", { title: task }, {
      headers: { Authorization: "Bearer " + token }
    });
    setTask("");
    loadTasks();
  };

  const completeTask = async (id) => {
    await axios.put(API + `/tasks/${id}`, {}, {
      headers: { Authorization: "Bearer " + token }
    });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(API + `/tasks/${id}`, {
      headers: { Authorization: "Bearer " + token }
    });
    loadTasks();
  };

  // Enter Key Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    isLogin ? login() : register();
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    createTask();
  };

  return (
    <div className="app">
      {!token ? (
        <div className="auth-container">
          <div className="logo">TaskFlow</div>
          <p className="tagline">Organize your life. Stay productive.</p>
          <div className="auth-box">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <form onSubmit={handleAuthSubmit}>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            {message && <p className="msg">{message}</p>}
            <p onClick={() => { setIsLogin(!isLogin); setMessage(""); }} className="toggle">
              {isLogin ? "New here? Create account" : "Already have account? Login"}
            </p>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <div className="header">
            <h1>TaskFlow Dashboard</h1>
            <button className="logout" onClick={() => { setToken(""); setEmail(""); setPassword(""); }}>Logout</button>
          </div>

          <form className="task-input" onSubmit={handleTaskSubmit}>
            <input value={task} onChange={e => setTask(e.target.value)} placeholder="What needs to be done?" />
            <button type="submit">Add Task</button>
          </form>
          
          <div className="filters">
            <button className={filter === "all" ? "active" : ""} onClick={() => { setFilter("all"); setPage(0); loadTasks(token, 0, "all"); }}>All</button>
            <button className={filter === "completed" ? "active" : ""} onClick={() => { setFilter("completed"); setPage(0); loadTasks(token, 0, "completed"); }}>Completed</button>
            <button className={filter === "pending" ? "active" : ""} onClick={() => { setFilter("pending"); setPage(0); loadTasks(token, 0, "pending"); }}>Pending</button>
          </div>

          <div className="task-list">
            {tasks.length > 0 ? tasks.map(t => (
              <div key={t.id} className={`task-card ${t.completed ? "done" : ""}`}>
                <span>{t.title}</span>
                <div className="actions">
                  {!t.completed && <button className="complete-btn" onClick={() => completeTask(t.id)}>✔</button>}
                  <button className="delete-btn" onClick={() => deleteTask(t.id)}>✖</button>
                </div>
              </div>
            )) : <p style={{textAlign: 'center', opacity: 0.5}}>No tasks found</p>}
          </div>

          <div className="pagination">
            <button disabled={page === 0} onClick={() => { setPage(page - 1); loadTasks(token, page - 1, filter); }}>Prev</button>
            <span>Page {page + 1}</span>
            <button disabled={tasks.length < 5} onClick={() => { setPage(page + 1); loadTasks(token, page + 1, filter); }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;