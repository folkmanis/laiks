import { ChangeDetectionStrategy, Component, OnInit, Input, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Firestore, collection, collectionData, doc, query, collectionGroup, where, getDocs, getDocsFromCache, getDocFromCache, getDoc, Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject, switchMap, tap, map, combineLatest } from 'rxjs';
import { startOfHour, isEqual, isWithinInterval, subHours, addHours } from 'date-fns';
import { NpDataService, NpPrice } from '../lib/np-data.service';


@Component({
  selector: 'laiks-np-data',
  templateUrl: './np-data.component.html',
  styleUrls: ['./np-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NpDataComponent implements OnInit, OnDestroy, AfterViewInit {

  private observer: (() => void) | null = null;

  hour$ = new BehaviorSubject(new Date());
  @Input() set time(value: Date) {
    if (value instanceof Date && value.getHours() !== this.hour$.value.getHours())
      this.hour$.next(value);
  }

  prices?: NpPrice[];


  price$ = combineLatest({
    time: this.hour$,
    npData: this.npDataService.npData$,
  })
    .pipe(
      tap(({ time, npData: { prices } }) => console.log('time', time, prices)),
      map(({ time, npData }) => npData.prices.filter(({ startTime, endTime }) => isWithinInterval(time, { start: subHours(startTime, 2), end: addHours(endTime, 1) }))),
      map(data => data.map(d => ({
        value: d.value,
        startTime: d.startTime,
        endTime: d.endTime,
      }))),
      // tap(() => this.chDetector.markForCheck()),
    );

  constructor(
    private npDataService: NpDataService,
    private zone: NgZone,
    private chDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.price$.subscribe(p => {
      this.zone.run(() => {
        this.prices = p;
        console.log(this.prices);
        this.chDetector.markForCheck();
      });
    });
    setTimeout(() => this.observer = this.npDataService.connectUpdateTime(), 1000);
    // this.observer = this.npDataService.connectUpdateTime();
  }
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer();
    }
  }

}
