import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  fullNameLength = 0;
  //This object contains all validation messages of form control
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.'
    },
    'phone': {
      'required': 'Phone is required.'
    }
  };
  //This object will only contain validation messages of failed form controls and bind these to UI
  formErrors = {
    'fullName': '',
    'email': '',
    'phone': ''
  };
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),

    //   //Nested form group
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      email: ['', Validators.required],
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    // this.employeeForm.get('fullName').valueChanges.subscribe((values: string) => {
    //   console.log(values);
    //   this.fullNameLength = values.length;
    // });

    this.employeeForm.valueChanges.subscribe(values => {
      this.logValidationErrors(this.employeeForm);
    });

    // this.employeeForm.get('skills').valueChanges.subscribe(values => {
    //   console.log(JSON.stringify(values));
    // });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  logKeyValuePairs(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if(abstractControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractControl);
      } else {
        console.log('Key = ' + key + ' Value = ' + abstractControl.value);
        //abstractControl.disable();
      }
    });
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required] // we can also use initialize by name
    });
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)){
          const messages = this.validationMessages[key];
          // console.log(messages);
          // console.log(abstractControl.errors);
          for (const errorKey in abstractControl.errors){
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  onLoadKeyValuePair(): void {
    this.logKeyValuePairs(this.employeeForm);
  }

  onLoadValidation(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  onLoadDataClick(): void {
    this.employeeForm.setValue({
      fullName: 'Safayat Borhan',
      email: 'safayat@celimited.com',
      skills: {
        skillName: "C#",
        experienceInYears: 2,
        proficiency: 'beginner'
      }
    });
  }

  onLoadDataPatchClick(): void {
    this.employeeForm.patchValue({
      fullName: 'Safayat Borhan from patch',
      email: 'safayat@celimited.com from patch'
    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.get('fullName').value);
  }

  onContactPreferenceChange(selectedValue: string){
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }

}
