import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private admins: Admin[] = [];
  private adminActualSubject: BehaviorSubject<Admin | null>;
  isLoggedInSubject: BehaviorSubject<boolean | null>;

  constructor(private http: HttpClient) {
    this.adminActualSubject = new BehaviorSubject<Admin | null>(null);
    this.isLoggedInSubject = new BehaviorSubject<boolean | null>(null); // Inicializar el BehaviorSubject
  }

  getAdminActual(): Admin | null {
    return this.adminActualSubject.value;
  }

  setAdminActual(admin: Admin | null): void {
    this.adminActualSubject.next(admin);
    this.isLoggedInSubject.next(!!admin); // Actualizar estado de inicio de sesión
  }

  getAdmins(): Admin[] {
    return this.admins;
  }

  get isLoggedIn$(): Observable<boolean | null> { 
    return this.isLoggedInSubject.asObservable();
  }

  async loadAdminsFromJSON() {
    try {
      if (this.admins.length === 0) {
        const admins = await this.http.get<Admin[]>('http://localhost:5000/admins').toPromise();
        this.admins = admins || [];
      }
    } catch (error) {
      console.error('Error al obtener admins:', error);
      this.admins = [];
    }
  }

  obtenerCodigoAdmin(id: number): string | null {
    const admin = this.admins.find((admin) => admin.id === id);
    return admin ? admin.code : null;
  }
}


