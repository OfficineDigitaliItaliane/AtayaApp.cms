import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MdDialog, MD_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'ms-form-answer',
  templateUrl: './form-answer.component.html',
  styleUrls: ['./form-answer.component.scss']
})
export class FormAnswerComponent implements OnInit {
  public cardTitle: string
  public cardSubmitButtonTitle: string

  public form: FormGroup;

  public answer: any
  public audio: string
  public correct: boolean

  constructor(private fb: FormBuilder, public dialogRef: MdDialogRef<FormAnswerComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.correct = false
  }

  ngOnInit() {
    this.cardTitle = 'Carica la nuova risposta'
    this.cardSubmitButtonTitle = 'Carica risposta'

    this.form = this.fb.group({
      body: [null, Validators.compose([Validators.required])]
    })

    if (this.data && Object.keys(this.data).length > 0) {
      this.cardTitle = 'Modifica la risposta'
      this.cardSubmitButtonTitle = 'Modifica risposta'
      this.answer = this.data
      this.objToForm(this.answer)
    }
  }

  onFileNameChanged(fileName: string) {
    this.audio = fileName
  }

  isFormValid() {
    return (this.form.valid && this.correct !== undefined && this.audio !== undefined)
  }

  public objToForm(answer: any) {
    this.form.controls.body.setValue(answer.body)
    this.correct = answer.correct
    this.audio = answer.audio
  }

  public formToObj() {
    let obj = {}
    if (this.answer) {
      obj = this.answer
    }
    obj['body'] = this.form.controls.body.value 
    obj['correct'] = this.correct
    obj['audio'] = this.audio
    return obj
  }

  public onSubmit() {
    if (this.isFormValid()) {
      this.dialogRef.close(this.formToObj())
    }
  }
  
  public onClose() {
    this.dialogRef.close(undefined)
  }
}