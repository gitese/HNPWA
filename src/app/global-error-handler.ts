import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "./shared/services/notification.service";
import { CustomError } from "./store/models/custom-error.model";
import {throwError} from 'rxjs';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const notificationService = this.injector.get(NotificationService);
    if (error instanceof HttpErrorResponse) {

      
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        notificationService.dispatchError(this.getErrorMessage(900));

      } else {
        // Handle Http Error (error.status === 403, 404...)
        if(error.status !== 401){
          notificationService.dispatchError(this.getErrorMessage(error.status));
        }
        //if error is 401 , redirect to authentication page 
      }

      throwError({}); //throw blank error

    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      //Throw the error using an observable
      throwError(error);
    }
    
  }

  getErrorMessage(statusCode: number): CustomError {

    let responseStates = {
      0: "Please check your internet connection",
      404: "Endpoint does not exist",
      400: "Bad request from server",
      401: "Token has expired",
      403: "You do not have the permission to access this resource",
      408: "The request timed out",
      500: "A server error occurred while fetching data",
      700: "An unknown error has occurred",
      900: "Please check your internet connection"
    };

    let message: CustomError =  {

      statusCode: statusCode,
      title: 'Oops',
      text: responseStates[statusCode] || responseStates[700],
      type: 'error'
      
    };

    return message;
  }
}
