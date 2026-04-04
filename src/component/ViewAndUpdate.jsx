import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  pincode: "",
};

const EMP_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "ON_LEAVE",
  "RESIGNED",
  "TERMINATED",
];

const ViewAndUpdate = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    education: "",
    designationId: "",
    shiftId: "",
    hireDate: "",
    status: "",
    sameAsPermanent: false,
    currentAddress: { ...emptyAddress },
    permanentAddress: { ...emptyAddress },
  });

  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFullEditEnabled, setIsFullEditEnabled] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [empRes, desigRes, shiftRes] = await Promise.all([
          EmployeeService.getEmployeeById(id),
          EmployeeService.getDesignations(),
          EmployeeService.getShifts(),
        ]);

        const data = empRes.data;
        console.log("emp",empRes);
        console.log("deg",desigRes);
        console.log("shift",shiftRes);

        setDesignations(desigRes.data);
        setShifts(shiftRes.data);

        setEmployee({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          education: data.education || "",
          designationId: data.designation?.id || "",
          shiftId: data.shift?.id || "",
          hireDate: data.hireDate || "",
          status: data.status || "",
          sameAsPermanent: data.sameAsPermanent || false,
          currentAddress: data.currentAddress
            ? {
                addressLine1: data.currentAddress.addressLine1 || "",
                addressLine2: data.currentAddress.addressLine2 || "",
                city: data.currentAddress.city || "",
                district: data.currentAddress.district || "",
                state: data.currentAddress.state || "",
                country: data.currentAddress.country || "",
                pincode: data.currentAddress.pincode || "",
              }
            : { ...emptyAddress },
          permanentAddress: data.permanentAddress
            ? {
                addressLine1: data.permanentAddress.addressLine1 || "",
                addressLine2: data.permanentAddress.addressLine2 || "",
                city: data.permanentAddress.city || "",
                district: data.permanentAddress.district || "",
                state: data.permanentAddress.state || "",
                country: data.permanentAddress.country || "",
                pincode: data.permanentAddress.pincode || "",
              }
            : { ...emptyAddress },
        });
      } catch (error) {
        const msg = error.response?.data?.message || "Error while fetching employees,designation or shift";
             toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setEmployee((prev) => {
      const updated = {
        ...prev,
        [type]: { ...prev[type], [name]: value },
      };

      if (type === "currentAddress" && prev.sameAsPermanent) {
        updated.permanentAddress = { ...updated.currentAddress };
      }
      return updated;
    });
  };

  const handleSameAsToggle = (e) => {
    const checked = e.target.checked;
    setEmployee((prev) => ({
      ...prev,
      sameAsPermanent: checked,
      permanentAddress: checked
        ? { ...prev.currentAddress }
        : { ...emptyAddress },
    }));
  };

  const validate = () => {
    const newErrors = {};
    const onlyTextRegex = /^[A-Za-z .-]+$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (!employee.designationId)
      newErrors.designationId = "Designation is required";

    // if (!employee.hireDate) newErrors.hireDate = "Hire date is required";

    if (!employee.shiftId) newErrors.shiftId = "Shift is required";

    if (!employee.status) newErrors.status = "Status is required";

    if (isFullEditEnabled) {
      if (!employee.name) newErrors.name = "Name is required";
      else if (!onlyTextRegex.test(employee.name))
        newErrors.name = "Only characters allowed";

      if (!employee.phoneNumber)
        newErrors.phoneNumber = "Phone number is required";
      else if (!phoneRegex.test(employee.phoneNumber))
        newErrors.phoneNumber = "Invalid phone number";

      const validateAddress = (address, key) => {
        const addrErr = {};
        if (!address.addressLine1)
          addrErr.addressLine1 = "Address Line 1 required";
        if (!address.city) addrErr.city = "City required";
        else if (!onlyTextRegex.test(address.city))
          addrErr.city = "Only characters allowed";
        if (!address.district) addrErr.district = "District required";
        if (!address.state) addrErr.state = "State required";
        if (!address.country) addrErr.country = "Country required";
        if (!address.pincode) addrErr.pincode = "Pincode required";
        else if (!pincodeRegex.test(address.pincode))
          addrErr.pincode = "Invalid pincode";
        if (Object.keys(addrErr).length > 0) newErrors[key] = addrErr;
      };

      validateAddress(employee.currentAddress, "currentAddress");
      if (!employee.sameAsPermanent)
        validateAddress(employee.permanentAddress, "permanentAddress");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (!validate()) return;

    try {
      const payload = {
        ...employee,
        designationId: Number(employee.designationId),
        shiftId: Number(employee.shiftId),
      };
       
      console.log(payload);
      
      await EmployeeService.updateEmployeeByAdmin(id, payload);
      
      toast.success("Employee details update successully");
      setIsSuccess(true);
      setIsFullEditEnabled(false);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
             toast.error(msg);
    }
  };

  if (isLoading) return <p style={{ padding: 24 }}>Loading employee data...</p>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Employee Details — Admin View</h2>

        {isSuccess && (
          <p className={styles.success}> Employee updated successfully</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Admin Controls
              <span className={styles.badge}>Always Editable</span>
            </h3>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>Designation</label>
                <select
                  name="designationId"
                  value={employee.designationId}
                  onChange={handleChange}
                >
                  <option value="">-- Select Designation --</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
                {errors.designationId && (
                  <p className={styles.error}>{errors.designationId}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Hire Date</label>
                <input
                  type="date"
                  name="hireDate"
                  value={employee.hireDate}
                  onChange={handleChange}
                />
                {errors.hireDate && (
                  <p className={styles.error}>{errors.hireDate}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Employee Status</label>
                <select
                  name="status"
                  value={employee.status}
                  onChange={handleChange}
                >
                  <option value="">-- Select Status --</option>
                  {EMP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className={styles.error}>{errors.status}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Shift</label>
                <select
                  name="shiftId"
                  value={employee.shiftId}
                  onChange={handleChange}
                >
                  <option value="">-- Select Shift --</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
                {errors.shiftId && (
                  <p className={styles.error}>{errors.shiftId}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Employee Details</h3>
              <button
                type="button"
                className={
                  isFullEditEnabled ? styles.cancelBtn : styles.editBtn
                }
                onClick={() => {
                  setIsFullEditEnabled((prev) => !prev);
                  setErrors({});
                }}
              >
                {isFullEditEnabled ? "🔒 Lock Fields" : "✏️ Enable Full Edit"}
              </button>
            </div>

            <div className={styles.grid}>
              <Field
                label="Name"
                name="name"
                value={employee.name}
                onChange={handleChange}
                disabled={!isFullEditEnabled}
                error={errors.name}
              />
              <Field
                label="Email"
                name="email"
                value={employee.email}
                disabled={true}
              />
              <Field
                label="Phone Number"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleChange}
                disabled={!isFullEditEnabled}
                error={errors.phoneNumber}
              />
              <Field
                label="Education"
                name="education"
                value={employee.education}
                onChange={handleChange}
                disabled={!isFullEditEnabled}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Current Address</h3>
            <AddressFields
              prefix="currentAddress"
              data={employee.currentAddress}
              onChange={(e) => handleAddressChange(e, "currentAddress")}
              disabled={!isFullEditEnabled}
              errors={errors.currentAddress || {}}
            />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Permanent Address</h3>
              {isFullEditEnabled && (
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={employee.sameAsPermanent}
                    onChange={handleSameAsToggle}
                  />
                  Same as Current Address
                </label>
              )}
            </div>
            <AddressFields
              prefix="permanentAddress"
              data={employee.permanentAddress}
              onChange={(e) => handleAddressChange(e, "permanentAddress")}
              disabled={!isFullEditEnabled || employee.sameAsPermanent}
              errors={errors.permanentAddress || {}}
            />
          </div>

          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.saveBtn}>
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, error, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontWeight: 600, fontSize: 13, color: "#555" }}>
      {label}
    </label>
    <input
      style={{
        padding: "9px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 14,
        background: props.disabled ? "#f5f5f5" : "#fff",
        color: props.disabled ? "#888" : "#333",
      }}
      {...props}
    />
    {error && <p style={{ color: "red", fontSize: 12, margin: 0 }}>{error}</p>}
  </div>
);

const AddressFields = ({ data, onChange, disabled, errors }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    {[
      { label: "Address Line 1", name: "addressLine1" },
      { label: "Address Line 2", name: "addressLine2" },
      { label: "City", name: "city" },
      { label: "District", name: "district" },
      { label: "State", name: "state" },
      { label: "Country", name: "country" },
      { label: "Pincode", name: "pincode" },
    ].map(({ label, name }) => (
      <Field
        key={name}
        label={label}
        name={name}
        value={data[name] || ""}
        onChange={onChange}
        disabled={disabled}
        error={errors[name]}
      />
    ))}
  </div>
);

export default ViewAndUpdate;
