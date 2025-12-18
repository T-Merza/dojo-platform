export type WeeklyAvailabilityBlock = {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "18:00"
  endTime: string;   // "20:00"
  game: string;
  maxStudents: number;
};
