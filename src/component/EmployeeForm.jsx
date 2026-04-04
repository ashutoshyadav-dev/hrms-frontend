import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmployeeService from "../service/EmployeeService";
import styles from "./EmployeeForm.module.css";

const emptyAddress = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: ""
};

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    education: "",
    sameAsCurrent: false,
    currentAddress: { ...emptyAddress },
    permanentAddress: { ...emptyAddress }
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    EmployeeService.getMyProfile()
      .then(res => {
        const data = res.data;

        setEmployee(prev => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          education: data.education || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          currentAddress: data.currentAddress || emptyAddress,
          permanentAddress: data.permanentAddress || emptyAddress
        }));
      })
      .catch(error => {
        const msg = error.response?.data?.message || "error while getting employee detail";
     toast.error(msg);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;

    setEmployee(prev => {
      const updated = {
        ...prev,
        [type]: {
          ...prev[type],
          [name]: value
        }
      };

      if (type === "currentAddress" && prev.sameAsCurrent) {
        updated.permanentAddress = { ...updated.currentAddress };
      }

      return updated;
    });
  };

  const handleSameAsToggle = (e) => {
    const checked = e.target.checked;

    setEmployee(prev => ({
      ...prev,
      sameAsCurrent: checked,
      permanentAddress: checked
        ? { ...prev.currentAddress }
        : { ...emptyAddress } 
    }));
  };

  const validate = (values) => {
    const newErrors = {};

    const emailRegex = /^[A-Za-z+_.-][A-Za-z0-9+_.-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const onlyTextRegex = /^[A-Za-z .-]+$/;
    const onlyDigitsRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    const phoneRegex=/^[6-9][0-9]{9}$/;

    if (!values.name) newErrors.name = "Name is required";
    else if (!onlyTextRegex.test(values.name))
      newErrors.name = "Only characters allowed";

    if (!values.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(values.email))
      newErrors.email = "Invalid email format";

    if (!values.phoneNumber)
      newErrors.phoneNumber = "Phone number required";
    else if (!phoneRegex.test(values.phoneNumber))
      newErrors.phoneNumber = "Phone must be 10 digits and started from 6";

    if (!values.dateOfBirth) newErrors.dateOfBirth = "Date of birth required";
    else {
      const birthDate = new Date(values.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) newErrors.dateOfBirth = "Age must be 18+";
    }

    const validateAddress = (address, type) => {
      const addressErrors = {};

      if (!address.addressLine1)
        addressErrors.addressLine1 = "Address Line 1 required";
   
      if (!address.city)
        addressErrors.city = "City required";
       else if (!onlyTextRegex.test(address.city))
      addressErrors.city = "Only characters allowed";

      if (!address.district)
        addressErrors.city = "District required";
       else if (!onlyTextRegex.test(address.district))
      addressErrors.district = "Only characters allowed";

      if (!address.state)
        addressErrors.state = "State required";
       else if (!onlyTextRegex.test(address.state))
      addressErrors.state = "Only characters allowed";

      if (!address.country)
        addressErrors.country = "Country required";
       else if (!onlyTextRegex.test(address.country))
      addressErrors.country = "Only characters allowed";

      if (!address.pincode)
        addressErrors.pincode = "Pincode required";
      else if (!pincodeRegex.test(address.pincode))
        addressErrors.pincode = "Invalid pincode";

      if (Object.keys(addressErrors).length > 0)
        newErrors[type] = addressErrors;
    };

    validateAddress(values.currentAddress, "currentAddress");

    if (!values.sameAsCurrent)
      validateAddress(values.permanentAddress, "permanentAddress");

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getMaxDOB = () => {
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate(employee);
    if (!isValid) return;
 console.log("Employee",employee);
 
    EmployeeService.updateMyProfile(employee)
      .then(() => {
        toast.success("Employee Details updates successully");
        setIsSuccess(true);
      })
      .catch(error =>{
          const msg = error.response?.data?.message || "Error while updating employee details";
     toast.error(msg);
      });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Employee Profile</h2>

        {isSuccess && (
          <p style={{ color: "green" }}>
            Profile updated successfully
          </p>
        )}

        <form onSubmit={handleSubmit}>

       
          <div className={styles.section}>
            <h3>Basic Information</h3>

            <div className={styles.grid}>
              <Input label="Name" name="name"  required value={employee.name} onChange={handleChange} error={errors.name} />
              <Input label="Email" name="email"  required value={employee.email} onChange={handleChange} error={errors.email} />
              <Input label="Phone Number" name="phoneNumber" maxLength={10} required value={employee.phoneNumber} onChange={handleChange} error={errors.phoneNumber} />
              <Input type="date"  max={getMaxDOB()}  label="Date of Birth" name="dateOfBirth"  required value={employee.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
              <Input label="Education" name="education" value={employee.education} onChange={handleChange} />
            </div>
          </div>

        
          <div className={styles.section}>
            <h3>Current Address</h3>
            <div className={styles.grid}>
              {Object.keys(employee.currentAddress).map(field => (
                   <Input
                  key={field}
                  label={field}
                  name={field}
                  required={field !== "addressLine2"}
                  maxLength={field === "pincode" ? 6 : undefined} 
                  value={employee.currentAddress[field]}   
                  onChange={(e) => handleAddressChange(e, "currentAddress")}  
                  error={errors.currentAddress?.[field]}
                />
              ))}
            </div>
          </div>

        
          <div className={styles.checkboxWrapper}>
            <label>
              <input
                type="checkbox"
                checked={employee.sameAsCurrent}
                onChange={handleSameAsToggle}
              />
              Same as Current Address
            </label>
          </div>

          <div className={styles.section}>
            <h3>Permanent Address</h3>
            <div className={styles.grid}>
              {Object.keys(employee.permanentAddress).map(field => (
                <Input
                  key={field}
                  label={field}
                  name={field}
                  required={field !== "addressLine2"}
                  maxLength={field === "pincode" ? 6 : undefined} 
                  value={employee.permanentAddress[field]}
                  onChange={(e) => handleAddressChange(e, "permanentAddress")}
                  disabled={employee.sameAsCurrent}
                  error={errors.permanentAddress?.[field]}
                />
              ))}
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <button className={styles.saveBtn}>
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", disabled = false,  required = false, error, ...props }) => (
  <div className={styles.inputGroup}>
    <label>{label}
    {required && <span style={{ color: "red" }}> *</span>}
    </label>
    <input type={type} disabled={disabled} {...props} />
    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>
);

export default EmployeeForm;
