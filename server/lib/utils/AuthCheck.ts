import type { Request, Response, NextFunction } from 'express';

export function IsAuthenticated(req: Request, res: Response, next: NextFunction) {
   if (req.isAuthenticated()) return next();
   return res.redirect('/');
}

export function IsPatient(req: Request, res: Response, next: NextFunction) {
   if (req.isAuthenticated() && req.user.schema === 'Patient') return next();
   return res.redirect('/');
}
export function IsDoctor(req: Request, res: Response, next: NextFunction) {
   if (req.isAuthenticated() && req.user.schema === 'Doctor') return next();
   return res.redirect('/');
}
