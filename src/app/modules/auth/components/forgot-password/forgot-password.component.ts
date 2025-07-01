import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent {
 forgotPasswordForm: FormGroup;
  inputType: 'CURP' | 'RFC' = 'CURP'; // Default input type

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inputType: 'CURP' | 'RFC' }
  ) {
    if (data && data.inputType) {
      this.inputType = data.inputType;
    }
    this.forgotPasswordForm = this.fb.group({
      identifier: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
