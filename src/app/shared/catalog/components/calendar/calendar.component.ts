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

  startTime = signal<string>('');
  endTime = signal<string>('');
  durationHours = signal(history.state.duration);
  idService = signal(history.state.id);

  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth());
  arrayDays = signal<(number | '')[]>([]);
  selectedDay = signal<Date | null>(null);
  endDateTime = signal<Date | null>(null);

  startDate = computed(() => {
    if (!this.selectedDay() || !this.startTime()) return null;

    const d = this.selectedDay()!;
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate()
      .toString()
      .padStart(2, '0')} ${this.startTime()}`;
  });

  endDate = computed(() => {
    const end = this.endDateTime();
    if (!end) return null;

    return `${end.getFullYear()}-${(end.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${end.getDate()
      .toString()
      .padStart(2, '0')} ${this.endTime()}`;
  });


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

  selectDay(day: number | '') {
    if (day === '') return;

    const selected = new Date(
      this.currentYear(),
      this.currentMonth(),
      day
    );

    this.selectedDay.set(selected);
  }


  onStartTimeChange(value: string) {
    this.startTime.set(value);

    if (!value || !this.selectedDay()) {
      this.endTime.set('');
      this.endDateTime.set(null);
      return;
    }

    const [h, m] = value.split(':').map(Number);

    const start = new Date(this.selectedDay()!);
    start.setHours(h, m, 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + this.durationHours());

    this.endDateTime.set(end);

    const endTime =
      end.getHours().toString().padStart(2, '0') +
      ':' +
      end.getMinutes().toString().padStart(2, '0');

    this.endTime.set(endTime);
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

  formatTimeAMPM(time: string): string {
    if (!time) return '--:--';

    const [h, m] = time.split(':').map(Number);

    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;

    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  }


}
