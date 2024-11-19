import React, { useEffect, useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import './clients.css';

      function Client() {
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    Mobileno: "",
    email: "",
    remark: "",
    address: ""
  });

const [isLoading, setIsLoading]= useState(false);
const [clients,setClients]= useState([]);

//fetch users 
useEffect(()=>{
  fetchclients();
},[])
 const fetchclients=async ()=>{
  try{
const response =await axios.get(`http://localhost:3000/api/adduser`);
setClients(response.data);
  }
  catch(error){
console.error("error fetching data",error)
  }
}
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //validation the form to ensure all required fields are filled
  const validateForm=()=>{
    return(
      formData.firstname &&
      formData.lastname &&
      formData.Mobileno &&
      formData.email &&
      formData.remark &&
      formData.address
    );
  };

  // delete
  const handleDelete=async(clientId)=>{
    console.log(userId)
    //show confirmation alert
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
        const response=await fetch(`http://localhost:3000/api/client/${clientId}`,{method:"Delete"});
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
// add user handler send data to the backend
  const handleAddUser = async() => {
    if(!validateForm()){
      Swal.fire({
        title: "Error!",
        text: "Please fill in all the required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    setIsLoading(true);
    // logic for saving data
    setShowModel(false);
  };

  return (
    <div className='users-container'>
      <div className='topbar'>
        <input className='search-box' type='text' placeholder='search..' />
        <button className='add-usebtn' onClick={() => setShowModel(true)}>
          Add user
        </button>
      </div>

      {/* table show */}
      <table className='user-table'>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Mobileno.</th>
            <th>Email</th>
            <th>Remark</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ananya</td>
            <td>Singh</td>
            <td>91408208392</td>
            <td>ananya2@gmail.com</td>
            <td>Test</td>
            <td>Lucknow</td>
          </tr>
        </tbody>
      </table>

      {/* open showModel */}
      {showModel && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form className="user-form" onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
              <label>First name:</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
              />
              
              <label>Last name:</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
              
              <label>Mobileno.:</label>
              <input
                type="number"
                name="Mobile"
                value={formData.mobileno}
                onChange={handleInputChange}
              />
              
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              
              <label>Remark:</label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
              />
              
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />

              <div className="modal-btn">
                <button type="submit" className="savebtn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancelbtn"
                  onClick={() => setShowModel(false)}
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
    

export default Client
