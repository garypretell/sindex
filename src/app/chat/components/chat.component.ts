import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, flatMap, takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  roomChats$: Observable<any>;

  constructor(public auth: AuthService,
              public chatService: ChatService,
              public afs: AngularFirestore
              ) { }

  ngOnInit() {
    this.collection();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async collection() {
    await this.auth.user$.pipe(map(da => {
      if (da) {
        this.roomChats$ = this.afs.collection('usuarios', ref => ref.where('diocesis.id', '==', da.diocesis.id)
        .where('roles.admin', '==', true)
        .orderBy('lastSesion', 'desc')).valueChanges().pipe(map(datos => {
          return datos.map((change: any) => {
            const data = change;
            const user = data.uid;
            const roomname = (da.uid < user ? da.uid + user : user +  da.uid);
            const recibe = 'recibe_' + da.uid;
            const col = this.afs.collection(
              `mensajes`,
              ref => ref.where('chatId', '==', roomname ).where('recibe', '==', da.uid).where('estado', '==', recibe).
              orderBy('fecha', 'asc')
            );
            return col.valueChanges().pipe(
              map(ratings => Object.assign(data, { ratings }))
            );
          });
        }),
          flatMap(feeds => combineLatest(feeds))
        );
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  conectar(item) {
    this.chatService.conectar(item.uid);
  }

  trackByFn(index, item) {
    return item.id;
  }

}
