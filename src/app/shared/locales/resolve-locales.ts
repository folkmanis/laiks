import { inject } from '@angular/core';
import { Locale } from './locale';
import { LocalesService } from './locales.service';
import { ResolveFn } from '@angular/router';

export const resolveLocales: ResolveFn<Locale[]> = () =>
  inject(LocalesService).getLocales();
