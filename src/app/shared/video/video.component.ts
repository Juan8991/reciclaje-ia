import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, type OnInit } from '@angular/core';
import { videoService } from './service/video.service';
import { LoaderComponent } from '../loader/loader.component';
import { MatButtonModule } from '@angular/material/button';
import { DataModelPredict } from '../models/data-model.interface';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    MatButtonModule
  ],
  providers: [videoService],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement: ElementRef<HTMLVideoElement> | undefined;
  //private video: HTMLVideoElement;
  private stream: MediaStream | undefined;
  public canvas:HTMLCanvasElement;
  private interval: any;
  public prediction: string = '';
  public capturing: boolean = false;
  public showVideo=false;
  private itemsEn = [
    'aerosol_cans', 'aluminum_food_cans', 'aluminum_soda_cans',
    'cardboard_boxes', 'cardboard_packaging', 'clothing',
    'coffee_grounds', 'disposable_plastic_cutlery', 'eggshells',
    'food_waste', 'glass_beverage_bottles',
    'glass_cosmetic_containers', 'glass_food_jars', 'magazines',
    'newspaper', 'office_paper', 'paper_cups', 'plastic_cup_lids',
    'plastic_detergent_bottles', 'plastic_food_containers',
    'plastic_shopping_bags', 'plastic_soda_bottles', 'plastic_straws',
    'plastic_trash_bags', 'plastic_water_bottles', 'shoes',
    'steel_food_cans', 'styrofoam_cups', 'styrofoam_food_containers',
    'tea_bags'
  ];

  private itemsEs = [
    'Latas de aerosol', 'Latas de comida de aluminio', 'Latas de refresco de aluminio',
    'Cajas de cartón', 'Empaques de cartón', 'Ropa',
    'Posos de café', 'Cubiertos de plástico desechables', 'Cáscaras de huevo',
    'Desechos de comida', 'Botellas de bebidas de vidrio',
    'Contenedores cosméticos de vidrio', 'Tarros de comida de vidrio', 'Revistas',
    'Periódico', 'Papel de oficina', 'Tazas de papel', 'Tapas de vasos de plástico',
    'Botellas de detergente de plástico', 'Contenedores de comida de plástico',
    'Bolsas de compras de plástico', 'Botellas de refresco de plástico', 'Pajitas de plástico',
    'Bolsas de basura de plástico', 'Botellas de agua de plástico', 'Zapatos',
    'Latas de comida de acero', 'Tazas de espuma de poliestireno', 'Contenedores de comida de espuma de poliestireno',
    'Bolsas de té'
  ];


   
  constructor(private predictService: videoService,private cdr: ChangeDetectorRef) {
    //this.video = document.querySelector('video')!;
    this.canvas = document.createElement('canvas');
    if(this.videoElement){
      this.canvas.width = this.videoElement.nativeElement.videoWidth;
      this.canvas.height = this.videoElement.nativeElement.videoHeight;
    }else{
      this.canvas.width = 300;
      this.canvas.height = 225;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopVideo();
  }

  startVideo(): void {
    this.showVideo = true;
    if (!this.capturing) {
      
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          if(this.videoElement){
            this.videoElement.nativeElement.srcObject = stream;
            this.stream = stream;
            this.videoElement.nativeElement.play();
            this.capturing = true;
            this.interval = setInterval(() => this.captureFrame(), 1000); // Captura un frame cada segundo
          }else{
            console.error("this.videoElement nulo indefinido paso start video")
          }
        }).catch(error => {
          console.error('Error accessing the camera', error);
        });
      
    }
  }

  stopVideo(): void {
    this.prediction = "";
    this.cdr.detectChanges();
    if (this.capturing) {
      clearInterval(this.interval);
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.capturing = false;
    }
  }

  captureFrame(): void {
    if(this.videoElement){
        const context = this.canvas.getContext('2d');
        if(context){
          context.drawImage(this.videoElement.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
        }else{
          console.error("Contexto nulo o indefinido",context);
        }
        this.canvas.toBlob(blob => {
          if (blob) {
            this.predictService.getPredict(blob).subscribe({
              next:(response:DataModelPredict) => {
                this.prediction = `${this.itemsEs[response.prediction]}`;
                this.cdr.detectChanges();  // Forzar la detección de cambios
              },
              error:(error) => {
                console.error('Error:', error);
              }
          });
          }
        }, 'image/jpeg');
    }else{
      console.error("this.videoElement nulo indefinido paso capture frame")
    }
    
  }



}
