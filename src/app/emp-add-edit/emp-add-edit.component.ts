import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  
  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate'
  ]

  constructor (
    private _fb: FormBuilder, 
    private _empservice: EmployeeService, 
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group ({
      id: [data?.id || ''],
      firstName: [data?.firstName || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      dob: [data?.dob || '', Validators.required],
      gender: [data?.gender || '', Validators.required],
      education: [data?.education || '', Validators.required],
      company: [data?.company || '', Validators.required],
      experience: [data?.experience || '', Validators.required],
      packages: [data?.packages || '', Validators.required],
    })
  }
  
  ngOnInit(): void {
      this.empForm.patchValue(this.data);
  }

  onFormSubmit(){
    if(this.empForm.valid){
      if(this.data){
        this._empservice.updateEmployee(this.data.id, this.empForm.value).subscribe({
          next: (val:any) => {
            this._coreService.openSnackBar('Employee details Updated!');
            this._dialogRef.close(true); //refresh the link atomatically
          },
          error: (err:any) => {
              console.error(err);
          }
        })
      }else{
        this._empservice.addEmployee(this.empForm.value).subscribe({
          next: (val:any) => {
            this._coreService.openSnackBar('Employee added successfully!')
            this._dialogRef.close(true);
          },
          error: (err:any) => {
              console.log(err);
          }
        })
      }
      
    }
  }
  closeDialog() {
    this._dialogRef.close(false);
  }
}
