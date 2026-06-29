import React from "react";
import {
  Container, Paper, Typography, TextField, Button, Box, Grid,
  MenuItem, Divider, FormControlLabel, Checkbox, Radio, RadioGroup,
  FormControl, FormLabel,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===========================
   ZOD SCHEMA - FIXED DATE
=========================== */
const schema = z
.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(11, "Enter valid contact number"),
    cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "CNIC format: 12345-1234567-1"),

    age: z.coerce.number({ invalid_type_error: "Age is required" }).min(18, "Must be 18+"),

    dob: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string" || typeof arg === "number") return new Date(arg);
        return null;
      },
      z.date({ required_error: "Date of birth is required" })
    ),

    gender: z.string().min(1, "Select gender"),
    maritalStatus: z.string().min(1, "Select marital status"),
    nationality: z.string().min(2, "Required"),
    sameAsResidential: z.boolean().optional(),

    residentialAddress: z.object({
      address1: z.string().min(3, "Address required"),
      address2: z.string().optional(),
      city: z.string().min(2, "City required"),
      province: z.string().min(2, "Province required"),
      country: z.string().min(2, "Country required"),
      postalCode: z.string().min(4, "Postal code required"),
    }),

    postalAddress: z.object({
      address1: z.string().min(3, "Address required"),
      city: z.string().min(2, "City required"),
      province: z.string().min(2, "Province required"),
      country: z.string().min(2, "Country required"),
      postalCode: z.string().min(4, "Postal code required"),
    }),

    employmentStatus: z.string().min(1, "Required"),
    employmentType: z.string().min(1, "Select employment type"),
    companyName: z.string().optional(),
    designation: z.string().optional(),
    experience: z.coerce.number({ invalid_type_error: "Required" }).min(0, "Cannot be negative"),
    expectedSalary: z.string().min(1, "Required"),

    username: z.string().min(4, "Minimum 4 characters"),
    password: z.string().min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "One uppercase required")
    .regex(/[a-z]/, "One lowercase required")
    .regex(/[0-9]/, "One number required")
    .regex(/[^A-Za-z0-9]/, "One special character required"),

    confirmPassword: z.string(),
    skills: z.array(z.object({ value: z.string().min(1, "Skill required") })).min(1, "Add at least 1 skill"),
    education: z.array(z.object({
      degree: z.string().min(1, "Degree required"),
      institute: z.string().min(1, "Institute required"),
      year: z.string().min(4, "Year required"),
    })).min(1, "Add at least 1 education"),

    emergencyContact: z.object({
      name: z.string().min(2, "Name required"),
      relation: z.string().min(2, "Relation required"),
      phone: z.string().min(11, "Phone required"),
    }),

    terms: z.boolean().refine((val) => val === true, { message: "Accept terms" }),
  })
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ===========================
   APP
=========================== */
export default function App() {
  const {
    register, control, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "", cnic: "",
      age: "", dob: null, gender: "", maritalStatus: "", nationality: "",
      sameAsResidential: false,
      residentialAddress: { address1: "", address2: "", city: "", province: "", country: "", postalCode: "" },
      postalAddress: { address1: "", city: "", province: "", country: "", postalCode: "" },
      employmentStatus: "", employmentType: "", companyName: "", designation: "",
      experience: "", expectedSalary: "", username: "", password: "", confirmPassword: "",
      skills: [{ value: "" }], education: [{ degree: "", institute: "", year: "" }],
      emergencyContact: { name: "", relation: "", phone: "" }, terms: false,
    },
  });

  const { fields: skillFields, append: addSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });
  const { fields: educationFields, append: addEducation, remove: removeEducation } = useFieldArray({ control, name: "education" });

  const password = watch("password");
  const sameAsResidential = watch("sameAsResidential");
  const residentialAddress = watch("residentialAddress");

  React.useEffect(() => {
    if (sameAsResidential) {
      setValue("postalAddress", residentialAddress);
    }
  }, [sameAsResidential, residentialAddress, setValue]);

  const passwordStrength = password?.length >= 8? "Strong" : password?.length >= 5? "Medium" : "Weak";

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Registration Submitted Successfully");
    reset();
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: "1px solid #e5e7eb", boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Employee Registration Portal</Typography>
          <Typography color="text.secondary" mb={4}>Complete all required information</Typography>

          <Box component="form" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>

              {/* PERSONAL INFORMATION */}
              <Grid xs={12}>
                <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
                <Divider sx={{ mt: 1 }} />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField fullWidth label="First Name" {...register("firstName")} error={!!errors.firstName} helperText={errors.firstName?.message} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Last Name" {...register("lastName")} error={!!errors.lastName} helperText={errors.lastName?.message} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Email Address" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Contact Number" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField fullWidth label="CNIC" placeholder="12345-1234567-1" {...register("cnic")} error={!!errors.cnic} helperText={errors.cnic?.message} />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField fullWidth label="Age" type="number" {...register("age")} error={!!errors.age} helperText={errors.age?.message} />
              </Grid>

              {/* FIXED DATEPICKER */}
              <Grid xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Date of Birth"
                        value={field.value? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date? date.toDate() : null)}
                        maxDate={dayjs().subtract(18, 'year')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:!!errors.dob,
                            helperText: errors.dob?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid xs={12}>
                <FormControl error={!!errors.gender}>
                  <FormLabel>Gender</FormLabel>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    )}
                  />
                  <Typography color="error" variant="caption">{errors.gender?.message}</Typography>
                </FormControl>
              </Grid>

              <Grid xs={12} md={4}>
                <TextField select fullWidth label="Marital Status" {...register("maritalStatus")} error={!!errors.maritalStatus} helperText={errors.maritalStatus?.message}>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                </TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField fullWidth label="Nationality" {...register("nationality")} error={!!errors.nationality} helperText={errors.nationality?.message} />
              </Grid>

              {/* RESIDENTIAL ADDRESS */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Residential Address</Typography>
                <Divider />
              </Grid>
              <Grid xs={12}>
                <TextField fullWidth label="Address Line 1" {...register("residentialAddress.address1")} error={!!errors.residentialAddress?.address1} helperText={errors.residentialAddress?.address1?.message} />
              </Grid>
              <Grid xs={12}>
                <TextField fullWidth label="Address Line 2" {...register("residentialAddress.address2")} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="City" {...register("residentialAddress.city")} error={!!errors.residentialAddress?.city} helperText={errors.residentialAddress?.city?.message} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="Province" {...register("residentialAddress.province")} error={!!errors.residentialAddress?.province} helperText={errors.residentialAddress?.province?.message} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="Country" {...register("residentialAddress.country")} error={!!errors.residentialAddress?.country} helperText={errors.residentialAddress?.country?.message} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="Postal Code" {...register("residentialAddress.postalCode")} error={!!errors.residentialAddress?.postalCode} helperText={errors.residentialAddress?.postalCode?.message} />
              </Grid>

              {/* POSTAL ADDRESS */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Postal Address</Typography>
                <FormControlLabel control={<Checkbox {...register("sameAsResidential")} />} label="Same as Residential Address" />
                <Divider />
              </Grid>
              <Grid xs={12}>
                <TextField fullWidth label="Address Line 1" {...register("postalAddress.address1")} error={!!errors.postalAddress?.address1} helperText={errors.postalAddress?.address1?.message} disabled={sameAsResidential} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="City" {...register("postalAddress.city")} error={!!errors.postalAddress?.city} helperText={errors.postalAddress?.city?.message} disabled={sameAsResidential} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="Province" {...register("postalAddress.province")} error={!!errors.postalAddress?.province} helperText={errors.postalAddress?.province?.message} disabled={sameAsResidential} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="Country" {...register("postalAddress.country")} error={!!errors.postalAddress?.country} helperText={errors.postalAddress?.country?.message} disabled={sameAsResidential} />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField fullWidth label="Postal Code" {...register("postalAddress.postalCode")} error={!!errors.postalAddress?.postalCode} helperText={errors.postalAddress?.postalCode?.message} disabled={sameAsResidential} />
              </Grid>

              {/* EMPLOYMENT */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Employment Information</Typography>
                <Divider />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField select fullWidth label="Employment Status" {...register("employmentStatus")} error={!!errors.employmentStatus} helperText={errors.employmentStatus?.message}>
                  <MenuItem value="Employed">Employed</MenuItem>
                  <MenuItem value="Unemployed">Unemployed</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </TextField>
              </Grid>
              <Grid xs={12}>
                <FormControl error={!!errors.employmentType}>
                  <FormLabel>Employment Type</FormLabel>
                  <Controller
                    name="employmentType"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Full Time" control={<Radio />} label="Full Time" />
                        <FormControlLabel value="Part Time" control={<Radio />} label="Part Time" />
                        <FormControlLabel value="Contract" control={<Radio />} label="Contract" />
                        <FormControlLabel value="Internship" control={<Radio />} label="Internship" />
                      </RadioGroup>
                    )}
                  />
                  <Typography color="error" variant="caption">{errors.employmentType?.message}</Typography>
                </FormControl>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField fullWidth label="Company Name" {...register("companyName")} />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField fullWidth label="Designation" {...register("designation")} />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField fullWidth type="number" label="Experience (Years)" {...register("experience")} error={!!errors.experience} helperText={errors.experience?.message} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Expected Salary" {...register("expectedSalary")} error={!!errors.expectedSalary} helperText={errors.expectedSalary?.message} />
              </Grid>

              {/* ACCOUNT */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Account Credentials</Typography>
                <Divider />
              </Grid>
              <Grid xs={12}>
                <TextField fullWidth label="Username" {...register("username")} error={!!errors.username} helperText={errors.username?.message} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth type="password" label="Password" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth type="password" label="Confirm Password" {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
              </Grid>
              <Grid xs={12}>
                <Typography>Password Strength: <strong>{passwordStrength}</strong></Typography>
              </Grid>

              {/* SKILLS */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Skills</Typography>
                {skillFields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <TextField fullWidth label={`Skill ${index + 1}`} {...register(`skills.${index}.value`)} error={!!errors.skills?.[index]?.value} helperText={errors.skills?.[index]?.value?.message} />
                    <Button color="error" variant="contained" onClick={() => removeSkill(index)}>Remove</Button>
                  </Box>
                ))}
                <Button sx={{ mt: 2 }} onClick={() => addSkill({ value: "" })}>Add Skill</Button>
              </Grid>

              {/* EDUCATION */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Education</Typography>
                {educationFields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) auto", gap: 2, mt: 2 }}>
                    <TextField label="Degree" {...register(`education.${index}.degree`)} error={!!errors.education?.[index]?.degree} helperText={errors.education?.[index]?.degree?.message} />
                    <TextField label="Institute" {...register(`education.${index}.institute`)} error={!!errors.education?.[index]?.institute} helperText={errors.education?.[index]?.institute?.message} />
                    <TextField label="Passing Year" {...register(`education.${index}.year`)} error={!!errors.education?.[index]?.year} helperText={errors.education?.[index]?.year?.message} />
                    <Button color="error" onClick={() => removeEducation(index)}>Remove</Button>
                  </Box>
                ))}
                <Button sx={{ mt: 2 }} onClick={() => addEducation({ degree: "", institute: "", year: "" })}>Add Education</Button>
              </Grid>

              {/* EMERGENCY */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>Emergency Contact</Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid xs={12}>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 2 }}>
                  <TextField fullWidth label="Contact Name" {...register("emergencyContact.name")} error={!!errors.emergencyContact?.name} helperText={errors.emergencyContact?.name?.message} />
                  <TextField fullWidth label="Relationship" {...register("emergencyContact.relation")} error={!!errors.emergencyContact?.relation} helperText={errors.emergencyContact?.relation?.message} />
                  <TextField fullWidth label="Phone Number" {...register("emergencyContact.phone")} error={!!errors.emergencyContact?.phone} helperText={errors.emergencyContact?.phone?.message} />
                </Box>
              </Grid>

              {/* FILES */}
              <Grid xs={12} mt={2}>
                <Typography variant="h6" fontWeight="bold">Documents</Typography>
                <Divider />
              </Grid>
              <Grid xs={12}>
                <input type="file" onChange={(e) => setValue("resume", e.target.files[0])} />
              </Grid>

              {/* TERMS */}
              <Grid xs={12}>
                <FormControlLabel control={<Checkbox {...register("terms")} />} label="I accept Terms & Conditions" />
                {errors.terms && <Typography color="error" variant="caption">{errors.terms.message}</Typography>}
              </Grid>

              <Grid xs={12}>
                <Button type="submit" variant="contained" size="large">Submit Application</Button>
                <Button sx={{ ml: 2 }} variant="outlined" onClick={() => reset()}>Reset</Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}