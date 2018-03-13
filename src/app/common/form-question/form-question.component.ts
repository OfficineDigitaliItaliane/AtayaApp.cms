import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ms-form-question',
  templateUrl: './form-question.component.html',
  styleUrls: ['./form-question.component.scss']
})
export class FormQuestionComponent implements OnInit {
  public cardTitle: string
  public cardSubmitButtonTitle: string

  public form: FormGroup;

  public question: any
  public audio: string
  public answers: any[]

  constructor(private fb: FormBuilder, public dialogRef: MdDialogRef<FormQuestionComponent>, @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.cardTitle = 'Carica la nuova domanda'
    this.cardSubmitButtonTitle = 'Carica domanda'

    this.form = this.fb.group({
      body: [null, Validators.compose([Validators.required])]
    })

    this.answers = []

    if (this.data && Object.keys(this.data).length > 0) {
      this.cardTitle = 'Modifica la domanda'
      this.cardSubmitButtonTitle = 'Modifica domanda'
      this.question = this.data
      this.objToForm(this.question)
    }
  }

  onFileNameChanged(fileName: string) {
    this.audio = fileName
  }

  isFormValid() {
    return (this.form.valid && this.audio !== undefined)
  }

  public objToForm(answer: any) {
    this.form.controls.body.setValue(answer.body)
    this.audio = answer.audio
    this.answers = answer.answers
  }

  public formToObj() {
    let obj = {}
    if (this.question) {
      obj = this.question
    }
    obj['body'] = this.form.controls.body.value 
    obj['audio'] = this.audio
    obj['answers'] = this.answers
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