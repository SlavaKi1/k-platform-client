/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {throwError} from "rxjs";
import {Router} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {ConfirmationService} from "primeng/api";
import {catchError} from "rxjs/operators";
import {MediaService} from "../../../../../../../../modules/media";
import {LocalizePipe} from "../../../../../../../../modules/locale";
import {
  AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {Store} from "../../../../../../../../modules/store";
import {Explorer} from "../../../../../../../explorer";
import {ToastData, ToastEvent} from "../../../../../../../../global/vars";
import {usePreloader} from "../../../../../../../../modules/preloader/src/use-preloader";

@Component({
  selector: "delete-media-action-renderer",
  standalone: true,
  templateUrl: "./delete-media-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    ConfirmDialogModule,
    TranslocoPipe
  ],
})
export class DeleteMediaActionRendererComponent extends AbstractExplorerActionRenderer {

  readonly dialogKey = "del-media-action-dialog";
  private readonly confirmationService = inject(ConfirmationService);
  private readonly service = inject(MediaService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  deleteMedia() {
    this.confirmationService.confirm({
      key: this.dialogKey,
      accept: () => {
        this.service.remove(this.entityForm().controls.id.value).pipe(
          usePreloader(this.store, this.preloaderChannel),
          catchError((res) => {
            this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
            return throwError(res);
          })
        ).subscribe(() => {
          this.router.navigate(["/section/media"], {replaceUrl: true});
        });
      }
    });
  }

}
