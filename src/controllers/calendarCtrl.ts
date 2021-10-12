import { Controller, Get, ResponseView } from '@tsed/common';
import * as Express from 'express';

export interface Calendar {
  id: string;
  name: string;
}

@Controller('/calendars')
export class CalendarCtrl {
  @Get('/:id')
  async get(
    request: Express.Request,
    response: Express.Response
  ): Promise<Calendar> {
    return { id: request.params.id, name: 'test' };
  }

  @Get('/')
  @ResponseView('calendars/index')
  async renderCalendars(
    request: Express.Request,
    response: Express.Response
  ): Promise<Array<Calendar>> {
    return [{ id: '1', name: 'test' }];
  }
}
