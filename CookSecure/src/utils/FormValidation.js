// src/utils/FormValidation.js

/**
 * Field validation rules
 * 
 * @param {string} value - The field value to validate
 * @param {Object} options - Validation options
 * @returns {string|null} - Error message or null if valid
 */
import React, { useState } from 'react';
export const validateField = (value, options = {}) => {
    const { 
      required = false, 
      minLength = 0, 
      maxLength = null, 
      pattern = null,
      type = 'text',
      match = null,
      customValidator = null,
      fieldName = 'This field'
    } = options;
  
    // Required check
    if (required && (!value || value.trim() === '')) {
      return `${fieldName} is required`;
    }
  
    // Length checks
    if (value && minLength > 0 && value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
  
    if (value && maxLength && value.length > maxLength) {
      return `${fieldName} must be less than ${maxLength} characters`;
    }
  
    // Pattern check
    if (value && pattern && !pattern.test(value)) {
      return `${fieldName} format is invalid`;
    }
  
    // Email validation
    if (value && type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
  
    // Password validation
    if (value && type === 'password' && minLength > 0) {
      const hasLowerCase = /[a-z]/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      
      if (!(hasLowerCase && hasUpperCase && hasNumber)) {
        return 'Password must contain lowercase, uppercase, and numbers';
      }
    }
  
    // Match value check (e.g., for password confirmation)
    if (match !== null && value !== match) {
      return 'Values do not match';
    }
  
    // Custom validator
    if (customValidator && typeof customValidator === 'function') {
      const customError = customValidator(value);
      if (customError) {
        return customError;
      }
    }
  
    return null;
  };
  
  /**
   * Form validation utility
   * @param {Object} fields - Object containing field values
   * @param {Object} rules - Validation rules for each field
   * @returns {Object} - Object with errors and isValid property
   */
  export const validateForm = (fields, rules) => {
    const errors = {};
    let isValid = true;
  
    Object.keys(rules).forEach(fieldName => {
      const value = fields[fieldName];
      const fieldRules = rules[fieldName];
      
      const error = validateField(value, fieldRules);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    });
  
    return { isValid, errors };
  };
  
  /**
   * Custom hook for form validation
   */
  export const useFormValidation = (initialState, validationRules) => {
    const [formData, setFormData] = React.useState(initialState);
    const [errors, setErrors] = React.useState({});
    const [touched, setTouched] = React.useState({});
  
    // Update form data
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Validate field on change if it has been touched
      if (touched[name]) {
        const error = validateField(value, validationRules[name] || {});
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    };
  
    // Mark field as touched on blur and validate
    const handleBlur = (e) => {
      const { name, value } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));
      
      const error = validateField(value, validationRules[name] || {});
      setErrors(prev => ({ ...prev, [name]: error }));
    };
  
    // Validate entire form
    const validateAll = () => {
      const { isValid, errors: validationErrors } = validateForm(formData, validationRules);
      setErrors(validationErrors);
      
      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      
      return isValid;
    };
  
    return {
      formData,
      errors,
      touched,
      setFormData,
      handleChange,
      handleBlur,
      validateAll
    };
  };