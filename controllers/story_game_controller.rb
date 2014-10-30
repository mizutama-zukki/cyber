class StoryGameController < ApplicationController
  require 'json'
  before_filter :require_login_user 

  def showStoryGamePage
    json_file_path = "#{Rails.root}/app/data/stage/mapData.json"
    gon.map = JSON.parse(File.read(json_file_path))

    @user_blocks = UserBlock.get_user_blocks(current_user.id)

    @stageNum = params[:stageNum]

    blockIds = []

    @user_blocks.each do |block|
       blockIds.push(block.block_id)
    end

    @blocks = Block.get_block_info(blockIds)

    render :action => "index"
  end


  def updateUserStageData
    render :action => "index"
  end
end
