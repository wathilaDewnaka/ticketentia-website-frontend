import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

const BASE_URL = ['http://localhost:8080']


@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private stompClient: Stomp.Client | undefined;
  private messageSubject: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  getVipEvents(): Observable<any>{
    return this.http.get(BASE_URL + "/api/customer/events/vip")
  }

  getEvents(): Observable<any>{
    return this.http.get(BASE_URL + "/api/customer/events")
  }

  getEvent(sessionId : String): Observable<any>{
    return this.http.get(BASE_URL + "/api/customer/events/" + sessionId)
  }

  getHistory(customerId: String): Observable<any>{
    return this.http.get(BASE_URL + "/api/customer/history/" + customerId)
  }

  buyTicket(purchasingDetails: any): Observable<any>{
    return this.http.post(BASE_URL + "/api/customer/events/purchase-ticket", purchasingDetails)
  }

  connect(sessionId : string): void {
    this.stompClient = new Stomp.Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(str);
      }
    });

    console.log(sessionId)

    this.stompClient.onConnect = () => {
      console.log('Connected to STOMP WebSocket');

      // Subscribe to /topic/updates
      this.stompClient?.subscribe('/topic/updates/' + sessionId, (message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });

      // Send an initial message if needed
      this.sendMessage({ sessionId: 1 });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    this.stompClient.activate();
  }

  // Send a message to the /app/dashboard endpoint
  sendMessage(message: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/dashboard',
        body: JSON.stringify(message)
      });
    } else {
      console.error('STOMP client is not connected');
    }
  }

  // Observable to get incoming messages from /topic/updates
  getMessages() {
    return this.messageSubject.asObservable();
  }

  // Close the STOMP connection
  closeConnection(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
