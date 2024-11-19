import { useState, useEffect } from "react";
import "./users.css";

function Product() {
  const [showModal, setShowModal] = useState(false);
  const [formdata, setFormdata] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [products, setProducts] = useState([]); // Initialize as an empty array

  // Fetch products when component is mounted
  useEffect(() => {
    fetch("http://localhost:3000/api/getproducts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched products:", data); // Log the entire data
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data); // Access 'products' array from the response object
        } else {
          console.log("Expected an array in the products field");
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormdata((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append("name", formdata.name);
    formData.append("price", formdata.price);
    formData.append("description", formdata.description);
    formData.append("image", formdata.image);

    fetch("http://localhost:3000/api/postproducts", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product added successfully:", data);
        setShowModal(false); // Close the modal
        // Optionally, refresh product list or clear form here
      })
      .catch((error) => console.error("Error:", error));
    setShowModal(false);
  };

  return (
    <div className="users-container">
      <div className="top-bar">
        <input className="search-box" type="text" placeholder="Search ...product" />
        <button className="add-use-btn" onClick={() => setShowModal(true)}>
          Add Product
        </button>
      </div>

      {/* Table to show product data */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                {/* show image and video */}
                <td>

                  {product.image.endsWith(".mp4") || product.image.endsWith(".webm") || product.image.endsWith(".ogg") ? (
                    <video
                      src={`http://localhost:3000/${product.image}`}
                      alt={product.name}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                      controls //add the base 
                    />
                  
                  ) :
                  product.image.endsWith(".pdf")?(
                    
                    <a href={`http://localhost:3000/${product.image}`}
                     target="blank"
                     rel="noopener noreferrence"
                     style={{
                      display:"inline-block",
                      width:50,
                      height:50,
                      textDecoration:"none",
                      color:"blue",
                      textAlign:"center",
                      lineHeight:"50px",
                      border:"1px solid #ccc",
                      borderRadius:4 ,
                      backgroundColor:"#f9f9f9",
                      cursor:"pointer"
                     }}
                     >
                      VIew PDF
                      </a>
                  ):
                  
                  (
                    <img src={`http://localhost:3000/${product.image}`}
                      alt={product.name}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  )}
                  {console.log("images are: ", product.image)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found.</td>
            </tr>
          )}
        </tbody>

      </table>

      {/* Modal for adding a new product */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Product</h3>
            <form className="user-form" onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }}>
              <label>Product Name:</label>
              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleInputChange}
              />

              <label>Product Price:</label>
              <input
                type="number"
                name="price"
                value={formdata.price}
                onChange={handleInputChange}
              />

              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={formdata.description}
                onChange={handleInputChange}
              />

              <label>Upload Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
              />

              <div className="modal-buttons">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleAddProduct}
                >
                  Save
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

export default Product;