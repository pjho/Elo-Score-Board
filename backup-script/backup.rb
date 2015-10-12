#!/usr/bin/env ruby

require 'firebase'
require 'fileutils'

base_uri = 'https://{YOUR APP}.firebaseio.com/'
firebase = Firebase::Client.new(base_uri)

response = firebase.get('/players')

if response.success?
  now = Time.now
  path = "backups/#{now.strftime("%Y/%m")}/"

  unless File.directory?(path)
    FileUtils.mkdir_p(path)
  end

  fileName =  path + now.strftime("%Y.%m.%d-%H.%M") + '.json';

  File.open(fileName , 'w') do |f|
    f.write( response.raw_body )
  end

end
