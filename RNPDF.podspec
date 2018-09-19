require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|

  s.name           = 'RNPDF'
  s.version        = package['version'].gsub(/v|-beta/, '')
  s.summary        = package['description']
  s.author         = package['author']
  s.license        = package['license']
  s.homepage       = package['homepage']
  s.source         = { :git => 'https://github.com/rumax/react-native-PDFView.git', :tag => "v#{s.version}"}
  s.platform       = :ios, '7.0'
  s.preserve_paths = '*.js'

  s.dependency 'React'

  s.source_files = 'ReactNativeViewPDF/*.{h,m}'
  s.public_header_files = ['ReactNativeViewPDF/*.h']

end