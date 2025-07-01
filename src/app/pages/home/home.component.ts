import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;

  showTryOn = false;

  startTryOn() {
    this.showTryOn = true;

    // Start the camera
    setTimeout(() => {
      this.startCamera();
    }, 0);
  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch((err) => {
          console.error('Failed to access camera', err);
        });
    }
  }
  stopTryOn() {
    this.showTryOn = false;

    // إيقاف الكاميرا
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.nativeElement.srcObject = null;
    }
  }
}
