import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./users.css";

function Employee() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    address: "",
    remark: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/addemployee");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch users from the server.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle input change and update corresponding state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate the form to ensure all required fields are filled
  const validateForm = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.dob &&
      formData.email &&
      formData.address
    );
  };

  // delete
  const handleDelete = async (userId) => {
    console.log(userId);
    // show confirmation alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        // const response=await fetch(http://localhost:3000/api/user/${userId},{method:'Delete'})
        const response = await fetch(
            `http://localhost:3000/api/employee/${userId}`,  // Use backticks here
            { method: 'DELETE' }
          );
        if (response.ok) {
          Swal.fire("Deleted!, Userhas been deleted", "Success");
          fetchUsers();
        } else
          (error) => {
            console.log("the error is ", error);
            Swal.fire("Failed", "Failed to delete data");
          };
      } catch (error) {
        console.log("error", error);
        Swal.fire("Error", "There was an error");
      }
    } else {
      Swal.fire("Cancelled", "User is safe");
    }
  };

  // Add user handler (send data to backend)
  const handleAddUser = async () => {
    if (!validateForm()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all the required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send POST request to the backend API
      const response = await axios.post(
        "http://localhost:3000/api/addemployee",
        formData
      );
      console.log(response.data);

      // Show success alert using SweetAlert
      Swal.fire({
        title: "Success!",
        text: "User added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Add the new user to the list of users
      setUsers((prevUsers) => [...prevUsers, response.data]);

      // Close modal and reset the form
      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        address: "",
        remark: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      // Show error alert using SweetAlert
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the user. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="users-container">
      <div className="top-bar">
        <input className="search-box" type="text" placeholder="Search" />
        <button className="add-user-btn" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Remark</th>
            <th>Address</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.email}>
              {" "}
              {/* Use unique key */}
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.dob}</td>
              <td>{user.email}</td>
              <td>{user.remark}</td>
              <td>{user.address}</td>
              <td>
                {/* Placeholder for future Edit/Delete actions */}
                <button className="edit-btn">Edit</button>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  deleted
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding a new user */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form
              className="user-form"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form submission
                handleAddUser(); // Call handleAddUser on form submit
              }}
            >
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />

              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />

              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Remark</label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
              />

              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <div className="modal-buttons">
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employee;