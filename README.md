# Memory-Map

This application is a “visual journal” that allows users to document their lives on a location based interface. Makes hefty use of Google Maps API.

Instructions: There are two modes to this application, Display Mode (represented by an eye icon) and Edit Mode (represented by a pencil icon). The former allows you to view your memories on the map. The latter allows you to edit and add new pinpoints to the map. Proceed with Edit Mode to create your first marker.

Display Mode: Click a marker to preview a memory. Click the preview to open up the memory info panel. Click the marker again to hide the preview.

Edit Mode: Click anywhere on the map to create a marker. Click the marker to open up the memory edit panel. Fill out the memory form completely and hit submit. Click the marker in Display Mode to view the memory.

Link to site: [Memory Map](https://memory-map.github.io/Main/)

## Implementation Details

- Google Maps API to render map

- Custom overlays to draw text popups on map canvas (`google.maps.OverlayView`), with CSS to make them float/animate

- Firebase database to store and load "memories". Memories stored as object containing memory's physical location (longitude and latitude), along with user-supplied data (memory title, blurb, location, and date)

- Custom sidebar to create, edit, and view memories

- Two distinct modes: Display Mode and Edit Mode. These control how code responds to click events on map
