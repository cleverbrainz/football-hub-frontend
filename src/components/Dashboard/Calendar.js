import React, { useState, useCallback } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  ViewState, EditingState, IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  Toolbar,
  DragDropProvider,
  DateNavigator,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';
import { appointments } from '../../lib/appointments'


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState('2020-09-27')
  const [data, setData] = useState(appointments);

  const onCommitChanges = useCallback(({ added, changed, deleted }) => {
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      setData([...data, { id: startingAddedId, ...added }]);
    }
    if (changed) {
      setData(data.map(appointment => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)));
    }
    if (deleted !== undefined) {
      setData(data.filter(appointment => appointment.id !== deleted));
    }
  }, [setData, data]);

  return (
    <Paper style={{ maxWidth: '95vw', height: '86vh', padding: 0 }}>
      <Scheduler
        data={data}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={(date) => setCurrentDate(date)}
        />
        <EditingState
          onCommitChanges={onCommitChanges}
        />

        <WeekView
          startDayHour={7}
          endDayHour={19}
          cellDuration={30}
        />

        <Appointments />
       

        <IntegratedEditing />
    
        <AppointmentTooltip />
        <AppointmentForm />

        <Toolbar />
        <DateNavigator />
        <TodayButton />

        <DragDropProvider />
      </Scheduler>
    </Paper>
  );
};

export default Calendar
