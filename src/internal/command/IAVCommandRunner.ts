import { Observable } from 'rxjs';
import { AVCommand } from '@internal/AVCommand';
import { AVCommandResponse } from '@internal/AVCommandResponse';

export interface IAVCommandRunner {
    runRxCommand(command: AVCommand): Observable<AVCommandResponse>;
}