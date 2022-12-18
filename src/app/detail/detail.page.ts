import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  contact: any;
  constructor(private route: ActivatedRoute, private firestore: Firestore) { }

  ngOnInit() {
    let contactId = this.route.snapshot.paramMap.get('id');
    this.getContact(contactId);
  }

  async getContact(contactId: any) {
    const contactDoc = doc(this.firestore, `users/${contactId}`);
    const docData = await getDoc(contactDoc);
    this.contact = docData.data();
  }

}
