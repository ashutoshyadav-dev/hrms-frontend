// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h1>Welcome to HRMS</h1>
//         <p style={{ marginTop: "10px", color: "#555" }}>
//           Human Resource & Project Management System
//         </p>

//         <div style={{ marginTop: "30px" }}>
//           <p>
//             Already have an account?{" "}
//             <Link to="/login" style={styles.link}>
//               Login
//             </Link>
//           </p>

//           <p style={{ marginTop: "10px" }}>
//             First time here?{" "}
//             <Link to="/register" style={styles.link}>
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f4f6f9",
//      backgroundImage: 'url("https://hr.hwtpl.com/website/assets/img/blog/best-hrms-software-need-of-todays-hr.jpg")',
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat"
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: "40px",
//     borderRadius: "8px",
//     boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//     textAlign: "center",
//      zIndex: 10 
//   },
//   link: {
//     color: "#12498A",
//     fontWeight: "bold",
//     textDecoration: "none",
//     cursor: "pointer",
//   },
// };

// export default Home;


import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to HRMS</h1>

        <p style={styles.subtitle}>
          Human Resource & Project Management System
        </p>

        <div style={styles.buttonContainer}>
          <Link to="/login" style={styles.loginBtn}>
            Login
          </Link>

          <Link to="/register" style={styles.registerBtn}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      'url("https://hr.hwtpl.com/website/assets/img/blog/best-hrms-software-need-of-todays-hr.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1,
  },

  card: {
    position: "relative",
    zIndex: 2,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    padding: "50px",
    borderRadius: "15px",
    textAlign: "center",
    color: "#fff",
    width: "350px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "30px",
    opacity: 0.9,
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  loginBtn: {
    padding: "12px",
    backgroundColor: "#12498A",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },

  registerBtn: {
    padding: "12px",
    backgroundColor: "#ffffff",
    color: "#12498A",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};

export default Home;