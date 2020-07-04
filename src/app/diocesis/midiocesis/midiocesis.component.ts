import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-midiocesis',
  templateUrl: './midiocesis.component.html',
  styleUrls: ['./midiocesis.component.css']
})
export class MidiocesisComponent implements OnInit, OnDestroy {
  private id;
  constructor(private activatedroute: ActivatedRoute) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      // this.id = +params['id']; // (+) converts string 'id' to a number
      this.id = params.get('id');
   }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
