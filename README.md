## Frontend folder structure
viviana-admin/
├── node_modules/
│   ├── 
│
├── public/
│   ├── 
│
├── src/
│    │
│    ├── api/
│    │   ├── api.js                    # Axios base config
│    │   └── axiosInstance.js 
│    │   └── productService.js        # API functions for products
│    │
│    ├── assets/
│    │   ├──    
│    │
│    ├── components/
│    │   ├── layout/
│    │   │   ├── Sidebar.jsx           # Navigation sidebar
│    │   │   └── Header.jsx            # (Optional) Top header for branding, logout, etc.
│    │   │
│    │   ├── products/
│    │   │   ├── ProductList.jsx       # View all products in a table/grid
│    │   │   ├── ProductForm.jsx       # Add/Edit product
│    │   │   └── ProductDetails.jsx    # Single product detail view
│    │   │
│    │   └── categories/
│    │       └── CategoryManager.jsx   # Add/Edit/Delete categories
│    │   
│    ├── context/
│    │   ├── CategoryContext.jsx   
│    │   └── ProductContext.jsx  
│    │
│    ├── pages/
│    │   ├── Dashboard.jsx   
│    │   ├── Login.jsx            
│    │   ├── Signup.jsx              
│    │   └── NotFound.jsx              # 404 fallback page
│    │
│    ├── utils/
│    │   ├── config.js          
│    │   └── uploadImage.js           
│    │
│    ├── App.jsx                       # Main router + layout wrapper
│    ├── index.css                     # TailwindCSS
│    └── main.jsx                      # Entry point
│
├──  .gitignore
├──  eslint.config.js
├──  index.html
├──  package-lock.json
├──  package.json
├──  README.md
└──  vite.config.js

## Backend folder structure
viviana-backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── productController.js
│   └── uploadController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── upload.js
│   └── verifyToken.js
│
├── node_modules/
│   ├── 
│
├── routes/
│   ├── auth.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   └── uploadRoutes.js
│
├── uploads/
│   ├── img.png                  # Uploaded images will be stored here
│
├── .env
├── package-lock.json
├── package.json
├── README.md
└── server.js
