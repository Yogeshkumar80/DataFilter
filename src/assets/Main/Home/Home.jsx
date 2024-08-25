import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterTitle, setFilterTitle] = useState("");
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedMembersFilter, setAssignedMembersFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    order: "",
    serialNo: "",
    taskTitle: "",
    taskId: "",
    status: "",
    assignedMembers: "",
    dueDate: "",
    isAssigned: false,
    estimatedHours: "",
    priority: "",
    createdOn: "",
    action: "Save",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/tasks")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const addNewRow = () => {
    setShowModal(true);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedData = [...data];
      updatedData[index][name] = value;
      setData(updatedData);
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleSave = (index) => {
    if (index !== undefined) {
      const task = data[index];
      axios
        .post("http://localhost:3000/tasks", task)
        .then((res) => {
          const updatedData = [...data];
          updatedData[index] = res.data;
          setData(updatedData);
          setEditingRow(null);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post("http://localhost:3000/tasks", newTask)
        .then((res) => {
          setData([...data, res.data]);
          setShowModal(false);
          setNewTask({
            order: "",
            serialNo: "",
            taskTitle: "",
            taskId: "",
            status: "",
            assignedMembers: "",
            dueDate: "",
            isAssigned: false,
            estimatedHours: "",
            priority: "",
            createdOn: "",
            action: "Save",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (index) => {
    const task = data[index];
    axios
      .delete(`http://localhost:3000/tasks/${task.id}`)
      .then(() => {
        setData(data.filter((_, i) => i !== index));
      })
      .catch((err) => console.log(err));
  };

  const sortedData = () => {
    if (sortConfig.key) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  };

  const filteredData = () => {
    let filtered = sortedData();

    if (filterTitle) {
      filtered = filtered.filter((task) =>
        task.taskTitle.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }

    if (searchId) {
      filtered = filtered.filter((task) =>
        task.taskId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) =>
        task.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    if (assignedMembersFilter) {
      filtered = filtered.filter((task) =>
        task.assignedMembers
          .toLowerCase()
          .includes(assignedMembersFilter.toLowerCase())
      );
    }

    if (dueDateFilter) {
      filtered = filtered.filter((task) => task.dueDate === dueDateFilter);
    }

    return filtered;
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredData().slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="management">
          <h3>TASK MANAGEMENT TABLE</h3>
          {/* Filter Inputs */}
          <div>
            <input
              type="text"
              placeholder="Filter by Task Title..."
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Search by Task ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="filter-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Status</option>
              <option value="Uninitiated">Uninitiated</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              type="text"
              placeholder="Filter by Assigned Members..."
              value={assignedMembersFilter}
              onChange={(e) => setAssignedMembersFilter(e.target.value)}
              className="filter-input"
            />
            <input
              type="date"
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="filter-input"
            />
            <button onClick={addNewRow} className="btn">
              Create New Task{" "}
              <span style={{ color: "black" }}>
                <i className="fa-solid fa-plus"></i>
              </span>
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort("order")}>Order</th>
              <th onClick={() => requestSort("serialNo")}>Serial No.</th>
              <th onClick={() => requestSort("taskTitle")}>Task Title</th>
              <th onClick={() => requestSort("taskId")}>Task Id</th>
              <th onClick={() => requestSort("status")}>Status</th>
              <th>Assigned Members</th>
              <th onClick={() => requestSort("dueDate")}>Due Date</th>
              <th onClick={() => requestSort("isAssigned")}>Is Assigned</th>
              <th onClick={() => requestSort("estimatedHours")}>
                Estimated Hours
              </th>
              <th onClick={() => requestSort("priority")}>Priority</th>
              <th onClick={() => requestSort("createdOn")}>Created On</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((d, i) => (
              <tr key={i}>
                {editingRow === i ? (
                  <>
                    <td>
                      <input
                        type="number"
                        name="order"
                        value={d.order}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="serialNo"
                        value={d.serialNo}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="taskTitle"
                        value={d.taskTitle}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="taskId"
                        value={d.taskId}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <select
                        name="status"
                        value={d.status}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      >
                        <option value="Uninitiated">Uninitiated</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="assignedMembers"
                        value={d.assignedMembers}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="dueDate"
                        value={d.dueDate}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name="isAssigned"
                        checked={d.isAssigned}
                        onChange={(e) =>
                          handleInputChange(
                            {
                              ...e,
                              target: {
                                ...e.target,
                                value: e.target.checked,
                              },
                            },
                            i
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="estimatedHours"
                        value={d.estimatedHours}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="priority"
                        value={d.priority}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="createdOn"
                        value={d.createdOn}
                        onChange={(e) => handleInputChange(e, i)}
                        className="input-cell"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleSave(i)}
                        className="btn-save"
                      >
                        Save
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => setEditingRow(null)}
                        className="btn-edit"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{d.order}</td>
                    <td>{d.serialNo}</td>
                    <td>{d.taskTitle}</td>
                    <td>{d.taskId}</td>
                    <td>{d.status}</td>
                    <td>{d.assignedMembers}</td>
                    <td>{d.dueDate}</td>
                    <td>{d.isAssigned ? "Yes" : "No"}</td>
                    <td>{d.estimatedHours}</td>
                    <td>{d.priority}</td>
                    <td>{d.createdOn}</td>
                    <td>
                      <button
                        onClick={() => setEditingRow(i)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(i)}
                        className="btn-save"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Component */}
        <div className="pagination-nav">
          <ul className="pagination">
            {Array(Math.ceil(filteredData().length / tasksPerPage))
              .fill()
              .map((_, i) => (
                <li key={i} className={currentPage === i + 1 ? "active" : ""}>
                  <a onClick={() => paginate(i + 1)}>{i + 1}</a>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Modal for Adding New Task */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Task</h2>
            <div>
              <input
                type="number"
                placeholder="Order"
                name="order"
                value={newTask.order}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="number"
                placeholder="Serial No."
                name="serialNo"
                value={newTask.serialNo}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Task Title"
                name="taskTitle"
                value={newTask.taskTitle}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Task Id"
                name="taskId"
                value={newTask.taskId}
                onChange={handleInputChange}
                className="modal-input"
              />
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="modal-input"
              >
                <option value="Uninitiated">Uninitiated</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Assigned Members"
                name="assignedMembers"
                value={newTask.assignedMembers}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="number"
                placeholder="Estimated Hours"
                name="estimatedHours"
                value={newTask.estimatedHours}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Priority"
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Created On"
                name="createdOn"
                value={newTask.createdOn}
                onChange={handleInputChange}
                className="modal-input"
              />
              <button onClick={() => handleSave()} className="btn-save">
                Save
              </button>
              <button onClick={() => setShowModal(false)} className="btn-edit">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
