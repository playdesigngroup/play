require 'rubygems'
require 'sinatra'
require 'hominid'

get '/' do
  erb :index
end

post '/newsletter' do
  h = Hominid::API.new('341206583fe675d99d4413131f638807-us4')
  d = h.lists['data'].first
  company = params[:company]
  field = params[:field]
  email = params[:email]
  h.list_subscribe(d['id'], email, {'MMERGE2' => company, 'MMERGE1' => field}, 'html', false, true, true, true)
end