import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './calendar.component.html',
  styles: [`

    .activate{
      background-color: #34D399;
      color: #E2E8F0;
      transition: all 0.5s;
    }

  `]
})
export class CalendarComponent implements OnInit {

  days = [
    'Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'
  ];

  today = new Date();

  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth());
  arrayDays = signal<(number | '')[]>([]);
  selectedDay = signal<number | ''>('');


  lastDay = computed(() =>
    new Date(this.currentYear(), this.currentMonth() + 1, 0).getDate()
  );


  firstDay = computed(() =>
    new Date(this.currentYear(), this.currentMonth(), 1).getDay()
  );


  date = computed(() =>
    new Date(this.currentYear(), this.currentMonth(), 1)
  );

  ngOnInit(): void {
    this.generateCalendar();
  }

  selectDay(day : number | ''){
    this.selectedDay.set(day);
  }


  generateCalendar() {

    const emptySlots = this.firstDay() === 0 ? 6 : this.firstDay() - 1;
    const calendar: (number | '')[] = [];


    for (let i = 0; i < emptySlots; i++) calendar.push('');


    for (let d = 1; d <= this.lastDay(); d++) calendar.push(d);

    this.arrayDays.set(calendar);
  }


  nextMonth(step: number) {
    let m = this.currentMonth() + step;
    let y = this.currentYear();

    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }

    this.currentMonth.set(m);
    this.currentYear.set(y);

    this.generateCalendar();
  }

  isPastDay(day: number | ''): boolean {
    if (day === '') return true;

    const cellDate = new Date(this.currentYear(), this.currentMonth(), day);

    return cellDate < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  }

  isToday(day: number | ''): boolean {
    if (day === '') return false;

    return (
      day === this.today.getDate() &&
      this.currentMonth() === this.today.getMonth() &&
      this.currentYear() === this.today.getFullYear()
    );
  }

}
