/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, Inject, type OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog'
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ProductReviewService } from '../Services/product-review.service'
import { MatSnackBar } from '@angular/material/snack-bar'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowCircleLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { type Review } from '../Models/review.model'
import { SnackBarHelperService } from '../Services/snack-bar-helper.service'
import { MatButton } from '@angular/material/button'
import { NgIf } from '@angular/common'
import { MatInput } from '@angular/material/input'
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field'
import { TranslateModule } from '@ngx-translate/core'
import { FlexModule } from '@angular/flex-layout/flex'

library.add(faPaperPlane, faArrowCircleLeft)

@Component({
  selector: 'app-product-review-edit',
  templateUrl: './product-review-edit.component.html',
  styleUrls: ['./product-review-edit.component.scss'],
  standalone: true,
  imports: [MatDialogContent, FlexModule, TranslateModule, MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, MatHint, NgIf, MatError, MatDialogActions, MatButton, MatDialogClose]
})
export class ProductReviewEditComponent implements OnInit {
  public editReviewControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(160)])
  public error: string | null = null

  constructor (@Inject(MAT_DIALOG_DATA) public data: { reviewData: Review }, private readonly productReviewService: ProductReviewService, private readonly dialogRef: MatDialogRef<ProductReviewEditComponent>,
    private readonly snackBar: MatSnackBar, private readonly snackBarHelperService: SnackBarHelperService) { }

  ngOnInit (): void {
    this.editReviewControl.setValue(this.data.reviewData.message)
  }

  editReview () {
    this.productReviewService.patch({ id: this.data.reviewData._id, message: this.editReviewControl.value }).subscribe(() => {
      this.dialogRef.close()
    }, (err) => {
      console.log(err)
      this.error = err
    })
    this.snackBarHelperService.open('CONFIRM_CHANGES_SAVED')
  }
}
