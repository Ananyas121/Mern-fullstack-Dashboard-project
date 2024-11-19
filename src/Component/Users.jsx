import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Swal from "sweetalert2";
import './users.css';
import {jsPDF} from "jspdf";
import "jspdf-autotable";




function User(){
  const[users,setUsers]=useState([])
  const [filterusers,setFilterusers]=useState([]);
  const [searchItem,setSearchItem]=useState("");
  const [message,setMessage]=useState()
  const [isLoading,setIsLoading]=useState(false)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    address: "",
    remark: "",
  });
 //edit part
 const[IsEditMode,setIsEditMode]=useState(false);
 const[currentuserid,setcurrentUserId]=useState(null);
 // Handle input change and update corresponding state
 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

 

//exportb to pdf
const exportToPDf=()=>{
  const doc=new jsPDF();
  doc.text("User Data",20,10);
  // define columns and table
  const columns=["firstName","lastName","dob","email","address","remark"];
  const rows=filterusers.map(user=>[
    user.firstName,
    user.lastName,
    user.dob,
    user.email,
    user.address,
    user.remark

  ]
  )
// generate table in pdf 
doc.autoTable ({
  startY:20,
  head:[columns],
  body:rows,
});
//save the pdf
doc.save("userData.pdf");
}

  // Fetch users when the component mounts
  // useEffect(() => {
  //   fetchUsers();
  // },[])
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3000/api/adduser');
  //       setFilterusers(response.data);
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       // Swal.fire({
  //       //   title: 'Error!',
  //       //   text: 'Failed to fetch users from the server.',
  //       //   icon: 'error',
  //       //   confirmButtonText: 'OK',
  //       // });
  //     }
  //   };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/adduser');
      setUsers(response.data);
      setFilterusers(response.data);
      console.log("Fetched users:", response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

    //search item
    const handleSearch=(e)=>{
      const term=e.target.toLowercase();
      setSearchItem(term);
      const filterList=users.filter(user=>{
        user.firstName.toLowercase().includes(term)
        ||user.lastName.toLowercase().includes(term)
        ||user.email.toLowercase().includes(term)
      });
      setFilterusers(filterList);
    }

   
// delete
const handleDelete=async (userId)=>{
  console.log(userId)
  // show confirmation alert
  const result=await Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this user.',
    icon:"warning",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  })
  if(result.isConfirmed){
    try{
      // const response=await fetch(http://localhost:3000/api/user/${userId},{method:'Delete'})
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {method: "DELETE",});
      if(response.ok){
        Swal.fire("Deleted!, Userhas been deleted","Success")
        fetchUsers()
      }
      else(error)=>{
        console.log("the error is ",error);
        Swal.fire("Failed","Failed to delete data")
        
      }
    }
    catch (error){
console.log("error",error)
Swal.fire("Error","There was an error")
    }
  }
  else{
    Swal.fire("Cancelled","User is safe")
  }
}



// edit
const handleEdit=(user)=>{
  console.log(user);
  setFormData({
    firstName:user.firstName,
    lastName:user.lastName,
    dob:user.dob,
    email:user.email,
    remark:user.remark,
    address:user.address,

  })
  setcurrentUserId(user._id);
  setIsEditMode(true);
  setShowModal(true);
}



 

  // // Validate the form to ensure all required fields are filled
  // const validateForm = () => {
  //   return (
  //     formData.firstName &&
  //     formData.lastName &&
  //     formData.dob &&
  //     formData.email &&
  //     formData.address
  //   );
  // };




  // Add user handler (send data to backend)
//   const handleAddUser = async () => {

//     //logic for save data
//     const apiEndpoint=IsEditMode?`http://localhost:3000/api/edituser/${currentuserid}`
//     :"http://localhost:3000/api/user";
//     const apiMethod=IsEditMode ? 'put':'post';
//     console.log([apiMethod]);
//     // if (!validateForm()) {
//     //   Swal.fire({
//     //     title: "Error!",
//     //     text: "Please fill in all the required fields.",
//     //     icon: "error",
//     //     confirmButtonText: "OK",
//     //   });
//     //   return;
//     // }

//     setIsLoading(true);

//     try {
//       // Send POST request to the backend API
//       const response = await axios[apiMethod](apiEndpoint, formData);
//       console.log(response.data);

//       // Show success alert using SweetAlert
//       Swal.fire({
//         title: 'Success!',
//         text: 'User added successfully!',
//         icon: 'success',
//         confirmButtonText: 'OK',
//       })
//       if (IsEditMode) {
//         // Update existing user in the state
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user._id === currentuserid ? { ...user, ...formData } : user
//           )
//         )
//         console.log("upaded1")
//       } else {
//         setUsers((prevUsers) => [...prevUsers, response.data]); // Add new user
//         console.log("upaded2");

//       }
//     //  setUsers((prevUsers) => [...prevUsers, response.data]);
//      setShowModal(false);
//        setFormData({
//          firstName: "",
//          lastName: "",
//          dob: "",
//          email: "",
//          remark: "",
//          address: "",
//        });
//         console.log("upaded3");
//  } catch (error) {
//       if(error.response){
//         console.error("signup failed",error.response.data);
//         setMessage("signup failed");
//       } else if (error.request){
//         console.error("no response from server",error.request)  ;
//         setMessage("no response from server");
//       } else {
//         console.error("Error adding user:", error.message);
//         // Show error alert using SweetAlert
//         Swal.fire({
//           title: 'Error!',
//           text: 'There was an error adding the user. Please try again.',
//           icon: 'error',
//           confirmButtonText: 'Try Again',
//         });
//       }
//  }  
//   };
    

//handle add useerr 2
const handleAddUser = async () => {
  const apiEndpoint = IsEditMode
    ? `http://localhost:3000/api/edituser/${currentuserid}`
    : "http://localhost:3000/api/user";
  const apiMethod = IsEditMode ? 'put' : 'post';

  setIsLoading(true);

  try {
    const response = await axios[apiMethod](apiEndpoint, formData);
    Swal.fire({
      title: 'Success!',
      text: IsEditMode ? 'User updated successfully!' : 'User added successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    if (IsEditMode) {
      // Update the user in the state directly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === currentuserid ? { ...user, ...formData } : user
        )
      );
    } else {
      // Add new user to the state
      setUsers((prevUsers) => [...prevUsers, response.data]);
    }

    setShowModal(false);
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      remark: "",
      address: "",
    });
    setIsEditMode(false); // Reset edit mode
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'There was an error adding or updating the user. Please try again.',
      icon: 'error',
      confirmButtonText: 'Try Again',
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="users-container">
      <div className="top-bar">
        <input className="search-box" type="text" onChange={handleSearch} value={searchItem}  placeholder="Search..." />
        <button className="export-btn" onClick={exportToPDf}>Export To PDF</button>

        <button className="add-user-btn" onClick={() =>{

setFormData({
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  address: "",
  remark: "",
})
setIsEditMode(false);
    setShowModal(true)}}>
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
          {filterusers.map((user,index) => (
            <tr key={index}>
              
              {/* Use unique key */}
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.dob}</td>
              <td>{user.email}</td>
              <td>{user.remark}</td>
              <td>{user.address}</td>
              <td>
                {/* Placeholder for future Edit/Delete actions */}
                <button className="edit-btn" onClick={()=>  handleEdit(user)}>Edit</button>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  delete
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
            <h3>{IsEditMode ?"Edit user":"Add New User"}</h3>
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
                  {IsEditMode ? "Update" : "Save"}
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


export default User;