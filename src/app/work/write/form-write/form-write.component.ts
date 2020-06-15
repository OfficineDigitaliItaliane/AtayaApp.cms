import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTitleService } from '../../../core/page-title/page-title.service';
import { fadeInAnimation } from '../../../core/route-animation/route.animation';
import { Router } from '@angular/router'
import { Write } from './../write';
import { Section, SectionSolverService } from '../../section-solver.service'
import { WriteService } from './../write.service';
import { ActivatedRoute } from '@angular/router'
import { AuthenticationService } from './../../../authentication/authentication.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'ms-form-write',
  templateUrl: './form-write.component.html',
  styleUrls: ['./form-write.component.scss'], encapsulation: ViewEncapsulation.None,
  host: {
    '[@fadeInAnimation]': 'true'
  },
  animations: [fadeInAnimation]
})
export class FormWriteComponent implements OnInit {
  public cardTitle: string;
  public cardSubmitButtonTitle: string;
  public section: Section;
  public id: string;
  public write: Write;
  public form: FormGroup;
  public picture: string;
  public audio: string;
  public letters: string[];
  public pictureCredits: string;
  public audioCredits: string;

  constructor(
    private fb: FormBuilder,
    private pageTitleService: PageTitleService,
    private writeService: WriteService,
    private route: ActivatedRoute,
    private sectionService: SectionSolverService,
    private router: Router,
    public auth: AuthenticationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.cardTitle = 'Carica il nuovo esercizio';
    this.cardSubmitButtonTitle = 'Carica esercizio';
    this.route.params.subscribe(params => {
      this.translate.get('Scriviamo').subscribe((translatedText: string) => {
        this.pageTitleService.setTitle(translatedText);
      });
      this.section = this.sectionService.retrieveSection(params);
      this.id = String(params['id']);
      if (this.id !== 'undefined') {
        this.cardTitle = 'Modifica l\'esercizio';
        this.cardSubmitButtonTitle = 'Modifica esercizio';
        this.writeService.getOne(this.id).subscribe(
          res => {
            this.write = res as Write;
            this.objToForm(this.write);
          },
          err => console.log('Error occured : ' + err)
        );
      }
      this.form = this.fb.group({
        title: [null, Validators.compose([Validators.required])],
        word: [null, Validators.compose([Validators.required])]
      });
      this.letters = [];
    });
  }

  onFileNameChanged(fileName: string) {
    this.picture = fileName;
  }

  onPictureCreditsChanged(credits: string) {
    this.pictureCredits = credits;
  }

  onAudioChanged(fileName: string) {
    this.audio = fileName;
  }

  onAudioCreditsChanged(credits: string) {
    this.audioCredits = credits;
  }

  public onSubmit() {
    if (this.isFormValid()) {
      if (this.id !== 'undefined') {
        this.writeService.update(this.formToObj(), this.id).subscribe(
          res => {
            console.log(res);
            this.goToListPage();
          },
          err => console.log('Error occured : ' + err)
        );
      } else {
        this.writeService.create(this.formToObj()).subscribe(
          res => {
            console.log(res);
            this.goToListPage();
          },
          err => console.log('Error occured : ' + err)
        );
      }
    }
  }

  isFormValid() {
    return this.form.valid && this.picture !== undefined && this.audio !== undefined;
  }

  public goToListPage() {
    this.router.navigate([this.section.name + '/write']);
  }

  public objToForm(write: Write) {
    this.form.controls.title.setValue(write.title);
    this.form.controls.word.setValue(write.word);
    this.letters = write.letters;
    this.picture = write.picture.value;
    this.pictureCredits = write.picture.credits;
    this.audio = write.audio.value;
    this.audioCredits = write.audio.credits;
  }

  public formToObj() {
    let write = new Write();
    write.unit_id = this.section.id;
    if (this.write) {
      write = this.write;
    }
    write.title = this.form.controls.title.value;
    write.word = this.form.controls.word.value;
    write.picture.value = this.picture;
    write.picture.credits = this.pictureCredits;
    write.audio.value = this.audio;
    write.audio.credits = this.audioCredits;
    write.letters = this.letters;
    return write;
  }
}
