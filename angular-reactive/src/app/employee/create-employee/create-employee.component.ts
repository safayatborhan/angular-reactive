import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
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
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        // proficiency: ['']
        proficiency: ['beginner'] // we can also use initialize by name
      })
    });
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

}
