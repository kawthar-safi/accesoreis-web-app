import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnInit {
  images = [
    { src: 'assets/images/slider1.png', alt: 'First Slide' },
    { src: 'assets/images/slider 2.png', alt: 'Second Slide' },
    { src: 'assets/images/slider3.png', alt: 'Third Slide' },
  ];
  elements = [
    { name: 'Fire', icon: 'bi-fire', value: 'fire' },
    { name: 'Water', icon: 'bi-droplet', value: 'water' },
    { name: 'Earth', icon: 'bi-tree', value: 'earth' },
    { name: 'Air', icon: 'bi-cloud', value: 'air' },
  ];

  selectElement() {
    // ممكن تروحي على فلتر – أو تنقلي المستخدم لصفحة معينة
    // this.router.navigate(['/collection', element.value]);
  }
  @ViewChild('video', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('tryOnModal') tryOnModalRef!: ElementRef;

  ngAfterViewInit() {
    const modalEl = this.tryOnModalRef.nativeElement;

    modalEl.addEventListener('shown.bs.modal', () => {
      this.startCamera();
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      this.stopCamera();
    });
  }

  cameraPermissionDenied = false;
  startCamera() {
    this.cameraPermissionDenied = false; // نعيد تعيين الحالة كل مرة

    if (!this.videoElement?.nativeElement) {
      console.warn('Video element not available');
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch((err) => {
          console.error('Camera access denied:', err);
          this.cameraPermissionDenied = true;
        });
    } else {
      this.cameraPermissionDenied = true;
    }
  }
  stopCamera() {
    if (!this.videoElement || !this.videoElement.nativeElement) return;

    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.nativeElement.srcObject = null;
    }
  }
  ngOnInit(): void {
    if (
      window.location.hostname === 'localhost' &&
      window.location.port === '4200'
    ) {
      localStorage.clear();
    }
  }
}
