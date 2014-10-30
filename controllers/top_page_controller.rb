class TopPageController < ApplicationController
  def showTopPage
    require 'pp'
    if current_user.present?
      @user_blocks = UserBlock.get_user_blocks(current_user.id)
      blockIds = []
      @user_blocks.each do |block|
        blockIds.push(block.block_id)
      end

      @blocks = Block.get_block_info(blockIds)

      render :action => 'index'
    else
      render :text => "sessionがないよ"
    end
  end
end
